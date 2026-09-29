"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fromInput,
  getAtPath,
  setAtPath,
  toInput,
  type EditorField,
  type EditorSection,
} from "@/lib/page-copy/fields";

/**
 * O EDITOR DE TEXTOS DE UMA PÁGINA — uma coluna de seções, na ordem da página,
 * cada uma com seus campos; barra fixa no topo com o estado e o botão de salvar.
 *
 * DIRIGIDO POR DADOS: a lista de campos é o `EDITOR_SECTIONS` da página
 * (`lib/home-copy.ts`, `lib/about-copy.ts`). Para expor um texto novo, é
 * acrescentar o campo lá; esta tela não sabe o que cada campo é, só o `kind`.
 *
 * ERA O `HomeEditor` ATÉ 23-09, e virou genérico quando a About pediu o mesmo.
 * O que mudou foi só a origem dos dados: `sections`, `defaults` e `apiPath`
 * entram por prop em vez de serem importados de `lib/home-copy`. O componente
 * já era dirigido por dados; trocar dois imports por três props foi a extração
 * inteira.
 *
 * ⚠️ `defaults` E `sections` ATRAVESSAM A FRONTEIRA SERVIDOR→CLIENTE. Os dois
 * são JSON puro de propósito — string, número, array e objeto simples. Um
 * `EDITOR_SECTIONS` com função dentro (um `label` calculado, por exemplo) não
 * serializa e quebra a página inteira em tempo de render.
 *
 * TAMANHO DAS CAIXAS: `textarea` cresce com o conteúdo por script, e não por
 * `field-sizing: content`, porque o Safari (o iPhone da cliente) não tem a
 * propriedade.
 */
type Status = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

export default function CopyEditor<T>({
  initial,
  defaults,
  sections,
  apiPath,
  guideDir,
  siteHref,
  title,
  note,
}: {
  /** A copy em vigor (padrão + salvo), vinda do servidor para a tela abrir cheia. */
  initial: T;
  /** Os padrões em código — é contra eles que o "Restore original" compara. */
  defaults: T;
  sections: EditorSection[];
  /** A rota que faz GET/POST desta copy, ex.: `/api/about-copy`. */
  apiPath: string;
  /**
   * Pasta dos prints do guia em `public/`, ex.: `edit-about-guide`.
   *
   * AUSENTE = SEM COLUNA DE PRINT, e os campos ocupam a largura toda. É o que
   * as dez telas de serviço usam: o template das dez é o MESMO, então a foto
   * mostraria a mesma forma dez vezes e custaria ~70 JPEGs versionados. Lá o
   * "See on site ↗" de cada seção faz o trabalho, abrindo a página real na
   * âncora. Decidido com o cliente em 23-09.
   */
  guideDir?: string;
  /** Para onde vai o "View site ↗". */
  siteHref: string;
  /** O que a barra do topo escreve, ex.: "About page text". */
  title: string;
  /**
   * Um aviso extra abaixo da instrução, para quando editar esta página mexe em
   * OUTRA. Existe por causa das internas de serviço, cujo nome e sub-título
   * aparecem também nos cards da listagem.
   */
  note?: string;
}) {
  const [copy, setCopy] = useState<T>(initial);
  const [saved, setSaved] = useState<T>(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const dirty = useMemo(() => JSON.stringify(copy) !== JSON.stringify(saved), [copy, saved]);

  // Aviso do navegador ao fechar a aba com mudança não salva.
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const update = useCallback((field: EditorField, text: string) => {
    setCopy((prev) => setAtPath(prev, field.path, fromInput(field.kind, text)));
    setStatus((s) => (s.kind === "saved" || s.kind === "error" ? { kind: "idle" } : s));
  }, []);

  const resetField = useCallback(
    (field: EditorField) => {
      setCopy((prev) => setAtPath(prev, field.path, getAtPath(defaults, field.path)));
    },
    [defaults],
  );

  async function save() {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(copy),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Could not save.");
      setSaved(data.copy ?? copy);
      setCopy(data.copy ?? copy);
      setStatus({ kind: "saved" });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    }
  }

  // Ctrl/Cmd+S salva.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && status.kind !== "saving") void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, status.kind, copy]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* O banner de cookies e o botão do WhatsApp vêm do layout raiz e não
          fazem sentido numa tela de trabalho — o banner ainda cobria o botão
          de salvar do rodapé. Escondidos só aqui, por atributo. */}
      <style>{`[aria-label="Cookie consent"],[aria-label="Chat with us on WhatsApp"]{display:none!important}`}</style>
      {/* Barra do topo */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        {/* A BARRA QUEBRA EM DUAS LINHAS NO TELEFONE, e não é enfeite: com o
            botão de voltar somado ao que já havia, num iPhone de 390px sobravam
            ~40px para o título — ele sumia e o rótulo da marca escrevia por cima
            do estado. Com `flex-wrap`, o estado desce para uma linha só dele
            (`basis-full` abaixo de `md`) e a primeira linha fica com voltar,
            título e salvar, que é a ordem em que ela lê. */}
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4">
          {/* VOLTAR PARA O ÍNDICE. Com duas páginas editáveis, a cliente precisa
              de um caminho de volta na própria tela — o botão de voltar do
              navegador serve, mas com mudança pendente ele dispara o aviso de
              saída, que parece erro em vez de navegação.

              É um <a> com cara de botão, e não um <button> com `router.push`:
              o alvo é um endereço, então abrir em aba nova (o clique do meio,
              o Ctrl+clique) tem de funcionar.

              A palavra some abaixo de `md` e fica só a seta: nessa largura a
              barra já disputa espaço com o estado e o botão de salvar, que é a
              ação principal. */}
          <a
            href="/edit"
            className="flex shrink-0 items-center gap-1.5 border border-line px-3 py-2 text-[14px] font-medium text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <span aria-hidden>←</span>
            <span className="hidden md:inline">All pages</span>
            <span className="sr-only md:hidden">Back to all pages</span>
          </a>
          <div className="min-w-0 flex-1">
            {/* O rótulo da marca some no telefone: ele não informa nada que a
                tela inteira não diga, e é a linha mais barata a cortar para o
                título caber. */}
            <p className="hidden text-[11px] font-semibold uppercase tracking-[2px] text-brand md:block">
              Corporate DNA
            </p>
            <h1 className="truncate text-[17px] font-semibold leading-tight md:text-[20px]">{title}</h1>
          </div>
          <StatusPill status={status} dirty={dirty} className="order-last basis-full md:order-none md:basis-auto" />
          <a
            href={siteHref}
            target="_blank"
            rel="noreferrer"
            className="hidden text-[14px] font-medium text-ink underline underline-offset-4 hover:text-brand md:inline"
          >
            View site ↗
          </a>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || status.kind === "saving"}
            className="bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink/25"
          >
            {status.kind === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-10 lg:grid-cols-[180px_1fr]">
        {/* Índice de seções */}
        <nav className="hidden lg:block">
          <ol className="sticky top-24 space-y-1 text-[14px]">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#s-${s.id}`} className="flex gap-2 py-1 text-muted hover:text-brand">
                  <span className="w-5 text-[12px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main className="space-y-8">
          <p className="max-w-[640px] text-[15px] leading-relaxed text-muted">
            Edit any text below and click <strong className="text-ink">Save changes</strong>. The page updates
            within a few seconds. Leave a field empty to restore its original text.
          </p>
          {note && (
            <p className="max-w-[640px] border-l-2 border-brand pl-4 text-[14px] leading-relaxed text-ink">
              {note}
            </p>
          )}

          {sections.map((s, i) => (
            <section key={s.id} id={`s-${s.id}`} className="scroll-mt-24 border border-line bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
                <h2 className="text-[17px] font-semibold">
                  <span className="mr-2 text-[12px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <a
                  href={s.anchor}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] text-muted underline underline-offset-4 hover:text-brand"
                >
                  See on site ↗
                </a>
              </div>
              {/* O PRINT DA SEÇÃO FICA AO LADO DOS CAMPOS, e acompanha a rolagem
                  (sticky): com 19 campos no Client impact, uma imagem só no
                  topo já teria saído da tela quando ela chega no card 3.
                  Os arquivos vêm de `scripts/edit-page-guide-shots.mjs`. */}
              <div className={`grid gap-8 px-6 py-6 ${guideDir ? "xl:grid-cols-[minmax(0,1fr)_440px]" : ""}`}>
                {/* `content-start` prende os campos no TOPO. Sem ele o grid
                    herda `align-content: stretch`, e como a coluna do print dá
                    a altura da linha, três campos ao lado de uma imagem de
                    1.900px saíam espalhados com buracos de 200px entre eles.
                    Apareceu na Team, na seção Leadership, e valia para as três
                    telas. */}
                <div className="grid content-start gap-5 md:grid-cols-2">
                {s.fields.map((f) => (
                  <Field
                    key={f.path}
                    field={f}
                    value={toInput(f.kind, getAtPath(copy, f.path))}
                    changed={getAtPath(copy, f.path) !== getAtPath(saved, f.path)}
                    isDefault={
                      JSON.stringify(getAtPath(copy, f.path)) === JSON.stringify(getAtPath(defaults, f.path))
                    }
                    onChange={(t) => update(f, t)}
                    onReset={() => resetField(f)}
                  />
                ))}
                </div>
                {guideDir && (
                  <aside className="xl:order-none order-first">
                    <figure className="xl:sticky xl:top-24">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/${guideDir}/${s.id}.jpg`}
                        alt={`How the “${s.title}” section looks on the site`}
                        loading="lazy"
                        className="w-full border border-line bg-paper"
                      />
                      <figcaption className="mt-2 text-[12px] leading-snug text-muted">
                        How this section looks on the site. The picture does not update as you type — save and open
                        the site to see your changes.
                      </figcaption>
                    </figure>
                  </aside>
                )}
              </div>
            </section>
          ))}

          <div className="flex items-center justify-end gap-4 pb-16">
            <StatusPill status={status} dirty={dirty} />
            <button
              type="button"
              onClick={save}
              disabled={!dirty || status.kind === "saving"}
              className="bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink/25"
            >
              {status.kind === "saving" ? "Saving…" : "Save changes"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

/** `className` é de LAYOUT (ordem e largura na barra), nunca de tipografia. */
function StatusPill({
  status,
  dirty,
  className = "",
}: {
  status: Status;
  dirty: boolean;
  className?: string;
}) {
  let text = "All changes saved";
  let tone = "text-muted";
  if (status.kind === "saving") text = "Saving…";
  else if (status.kind === "error") {
    text = status.message ?? "Could not save";
    tone = "text-brand";
  } else if (status.kind === "saved" && !dirty) {
    text = "Saved — the site updates in a few seconds";
    tone = "text-emerald-700";
  } else if (dirty) {
    text = "Unsaved changes";
    tone = "text-ink";
  }
  return <span className={`text-[13px] font-medium ${tone} ${className}`}>{text}</span>;
}

function Field({
  field,
  value,
  changed,
  isDefault,
  onChange,
  onReset,
}: {
  field: EditorField;
  value: string;
  changed: boolean;
  isDefault: boolean;
  onChange: (text: string) => void;
  onReset: () => void;
}) {
  const multiline = field.kind !== "text";
  const wide = multiline || field.label.toLowerCase().includes("heading");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);

  const base =
    "w-full border bg-white px-3.5 py-2.5 text-[15px] leading-relaxed text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand";
  const border = changed ? "border-brand/60" : "border-line";

  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[12px] font-semibold uppercase tracking-[1px] text-ink/70">{field.label}</span>
        {!isDefault && (
          <button
            type="button"
            onClick={onReset}
            className="text-[12px] text-muted underline underline-offset-2 hover:text-brand"
          >
            Restore original
          </button>
        )}
      </span>
      {multiline ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={`${base} ${border} resize-none overflow-hidden`}
          style={{ fontFamily: field.kind === "lines" ? undefined : "var(--font-serif, Georgia, serif)" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} ${border}`}
        />
      )}
      {field.hint && <span className="mt-1 block text-[12px] text-muted">{field.hint}</span>}
    </label>
  );
}
