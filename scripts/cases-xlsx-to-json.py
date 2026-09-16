#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Converte o `CaseStudiesv1.xlsx` da Maliha no JSON que o CMS consome.

    python scripts/cases-xlsx-to-json.py [caminho/do.xlsx] [saida.json]

Le so as linhas com **coluna B = Yes** ("filter column B under yes", daily de
16/09) e devolve um registro por case, ja com as chaves que o `data` do CMS usa.

A planilha tem cabecalho na LINHA 2 (a linha 1 traz numeros soltos) e uma aba
unica, "Service by Client". Cada linha e um par cliente x servico -- por isso o
mesmo cliente pode aparecer duas vezes (Frasers Property) e o slug precisa do
sufixo do servico.

Mapa das colunas -> chaves do CMS:

    A  Service (website label)   -> serviceLabel, facets.service
    B  Reviewed                  -> (filtro, nao e gravado)
    C  Service banner statement  -> bannerStatement
    D  Client                    -> title            (so o nome: resolve o logo)
    E  Eyebrow: markets          -> markets          + countries (faixa atual)
    F  Eyebrow: partnership yrs  -> partnershipYears + reach     (faixa atual)
    G  Impact figures (vermelho) -> impactFigures[]  + impact    (faixa atual)
    H  Scale figures (carvao)    -> scaleFigures[]   + participants
    I  Challenge headline        -> challengeHeadline
    J  Challenge body            -> challenge
    K  What we did headline      -> approachHeadline
    L  What we did body          -> approach
    M  What changed body         -> outcome
    N  Quote                     -> quote + quoter
    O  Case status               -> (nao e gravado)
    P  Hero headline             -> headline
    Q  Hero sub-head             -> introduction (vira <p> porque e rich text)
    R  What changed headline     -> outcomeHeadline
    S  Closing thought           -> closingThought
    T  CDNA services             -> services[] + tags[]
    U,V Additional content       -> additionalContent
"""
import json
import re
import sys
import zipfile

XLSX = sys.argv[1] if len(sys.argv) > 1 else (
    "docs/meetings/CDNA — Photographs for the new website/"
    "5. Clients& Impact/CaseStudiesv1.xlsx"
)
OUT = sys.argv[2] if len(sys.argv) > 2 else "docs/meetings/cases-aprovados-16-09.json"

# Slug por (cliente, servico). Fixo e nao derivado do nome: o slug e a URL
# publica e nao pode mudar sozinho se ela reescrever o rotulo do servico.
SLUGS = {
    ("BT", "Manager Development"): "bt",
    ("DP World", "Manager Development"): "dp-world",
    ("Dyson", "Family Business Consulting"): "dyson",
    ("Frasers Property", "Top 150 Leadership Development"): "frasers-property-leadership",
    ("Frasers Property", "HRLT Effectiveness"): "frasers-property-hrlt",
    ("GSK", "Culture Transformation"): "gsk",
    ("Ma'aden", "HRLT Effectiveness"): "maaden",
    ("Morgan Stanley", "Culture Transformation"): "morgan-stanley",
    ("Vodafone", "Talent Development"): "vodafone",
}


def unesc(s):
    return (
        s.replace("&lt;", "<").replace("&gt;", ">")
        .replace("&quot;", '"').replace("&apos;", "'")
        .replace("&amp;", "&")
    )


def read_sheet(path):
    """xlsx -> {linha: {coluna: texto}}, sem dependencia externa."""
    z = zipfile.ZipFile(path)
    shared = [
        unesc(re.sub(r"<.*?>", "", si))
        for si in re.findall(r"<si>(.*?)</si>", z.read("xl/sharedStrings.xml").decode("utf8"), re.S)
    ]
    xml = z.read("xl/worksheets/sheet1.xml").decode("utf8")
    rows = {}
    # Uma celula vazia vem auto-fechada (`<c r="B7" s="3"/>`): sem o ramo `/>`
    # o `.*?</c>` engole a celula seguinte e desloca a linha inteira.
    for m in re.finditer(r'<c r="([A-Z]+)(\d+)"([^>]*?)(?:/>|>(.*?)</c>)', xml, re.S):
        col, row, attrs, inner = m.group(1), int(m.group(2)), m.group(3), m.group(4) or ""
        v = re.search(r"<v>(.*?)</v>", inner, re.S)
        if v is None:
            text = unesc(re.sub(r"<.*?>", "", inner))
        elif 't="s"' in attrs:
            text = shared[int(v.group(1))]
        else:
            text = unesc(v.group(1))
        if text.strip():
            rows.setdefault(row, {})[col] = text.strip()
    return rows


def split_list(value):
    """Coluna separada por ';' -> lista limpa."""
    if not value:
        return []
    return [p.strip() for p in value.split(";") if p.strip()]


def impact_figures(value):
    """
    "2,200: frontline managers; 20+: countries" -> [{value, label}].

    O ':' so separa numero de rotulo quando a frente TEM numero. Nem toda linha
    da coluna G e metrica: "Radical Candour: a new level of healthy challenge" e
    "ExCo -> RDD: leadership change" sao frases, e quebra-las em value/label
    perderia o dois-pontos e deixaria o texto sem sentido.

    Quando o item nao tem ':' (ela nem sempre usou), tenta destacar o numero da
    frente -- "94% content and immersion impact" -> 94% + o resto -- e, se nao
    houver numero, guarda so o label.
    """
    out = []
    for item in split_list(value):
        if ":" in item:
            head, tail = item.split(":", 1)
            if any(ch.isdigit() for ch in head):
                out.append({"value": head.strip(), "label": tail.strip()})
            else:
                out.append({"value": "", "label": item})
            continue
        m = re.match(r"^([\d.,]+\s*%?|[\d.,]+\s*\+)\s+(.*)$", item)
        if m:
            out.append({"value": m.group(1).strip(), "label": m.group(2).strip()})
        else:
            out.append({"value": "", "label": item})
    return out


def band_impact(figures, participants=""):
    """
    Escolhe qual das impact figures vai para a celula "Impact" da faixa atual --
    e, por tabela, para o numero grande do card em /our-clients.

    Duas restricoes:

    1. O `splitMetric` do site so destaca o PRIMEIRO token com digito, entao um
       valor de varias palavras ("73 to 81%") sairia quebrado como "73" + "to
       81% ...". Por isso a ordem e: porcentagem de um token -> qualquer numero
       de um token -> a primeira figura, seja ela qual for.
    2. A figura escolhida nao pode repetir a celula Participants. Em varios
       cases o primeiro numero da coluna G e o mesmo da H ("2,200 frontline
       managers"), e a faixa ficaria com a mesma frase duas vezes.
    """
    if not figures:
        return ""

    def render(f):
        return (f["value"] + " " + f["label"]).strip() if f["value"] else f["label"]

    dup = participants.strip().lower()
    single = [f for f in figures if f["value"] and " " not in f["value"]]
    pools = (
        [f for f in single if "%" in f["value"]],
        [f for f in single if any(ch.isdigit() for ch in f["value"])],
        figures,
    )
    fallback = ""
    for pool in pools:
        for f in pool:
            texto = render(f)
            if texto.strip().lower() != dup:
                return texto
            fallback = fallback or texto
    return fallback


def split_quote(value):
    """
    A citacao vem como `"texto" | atribuicao` -- as aspas sao tipograficas e
    variam. Sem o '|', assume que e tudo citacao e deixa a atribuicao vazia
    (ela ainda esta colhendo com a Rhea).
    """
    if not value:
        return "", ""
    parts = [p.strip() for p in value.split("|")]
    quote = parts[0].strip().strip('"“”').strip()
    quoter = parts[1].strip() if len(parts) > 1 else ""
    return quote, quoter


def main():
    rows = read_sheet(XLSX)
    approved = [r for r in sorted(rows) if r > 2 and rows[r].get("B", "").lower() == "yes"]

    cases, faltando = [], []
    for r in approved:
        d = rows[r]
        client, service = d.get("D", ""), d.get("A", "")
        slug = SLUGS.get((client, service))
        if not slug:
            faltando.append("linha %d: %s / %s" % (r, client, service))
            continue

        figures = impact_figures(d.get("G", ""))
        scale = split_list(d.get("H", ""))
        quote, quoter = split_quote(d.get("N", ""))
        services = split_list(d.get("T", ""))
        extra = "\n\n".join(v for v in (d.get("U"), d.get("V")) if v)
        sub_head = d.get("Q", "")

        cases.append({
            "slug": slug,
            "sourceRow": r,
            "sheetStatus": d.get("O", ""),
            "data": {
                # --- campos que o site ja le hoje ------------------------------
                "title": client,
                "headline": d.get("P", ""),
                "introduction": "<p>%s</p>" % sub_head if sub_head else "",
                "quote": quote,
                "quoter": quoter,
                "challenge": d.get("J", ""),
                "approach": d.get("L", ""),
                "outcome": d.get("M", ""),
                "tags": services,
                # Faixa atual (Countries -> Participants -> Reach -> Impact).
                # O primeiro item de H e sempre quem participou; a celula Impact
                # e a metrica que vira o numero do card em /our-clients.
                "countries": d.get("E", ""),
                "participants": scale[0] if scale else "",
                "reach": d.get("F", ""),
                "impact": band_impact(figures, scale[0] if scale else ""),
                # --- campos novos, do layout da adidas -------------------------
                "serviceLabel": service,
                "bannerStatement": d.get("C", ""),
                "markets": d.get("E", ""),
                "partnershipYears": d.get("F", ""),
                "impactFigures": figures,
                "scaleFigures": scale,
                "challengeHeadline": d.get("I", ""),
                "approachHeadline": d.get("K", ""),
                "outcomeHeadline": d.get("R", ""),
                "closingThought": d.get("S", ""),
                "services": services,
                "additionalContent": extra,
                "facets": {
                    "industry": [],
                    "service": [service] if service else [],
                    "region": [],
                    "outcome": [],
                },
            },
        })

    # Chave vazia nao e conteudo: some, para nao sobrescrever com "" o que o CMS
    # ja tem gravado (GSK e Morgan Stanley ja existem e sao mais completos).
    for c in cases:
        c["data"] = {
            k: v for k, v in c["data"].items()
            if v not in ("", [], None) and not (k == "facets" and not v["service"])
        }

    with open(OUT, "w", encoding="utf8", newline="\n") as fh:
        json.dump(cases, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    print("%d cases com Reviewed=Yes -> %s" % (len(cases), OUT))
    for c in cases:
        print("  %-28s %2d campos  (linha %d, status %s)" % (
            c["slug"], len(c["data"]), c["sourceRow"], c["sheetStatus"] or "-"))
    if faltando:
        print("\nSEM SLUG DEFINIDO (ignorados) -- adicione em SLUGS:")
        for f in faltando:
            print("  " + f)


if __name__ == "__main__":
    main()
