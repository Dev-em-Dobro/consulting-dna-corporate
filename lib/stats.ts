import { getPage } from "@/lib/cms/client";

/**
 * The firm-level statistics band — the editable statistics item 18 asks us to
 * preserve, now shared by the homepage and Our Impact (27-08 brief, item 9)
 * rather than re-declared per page.
 *
 * Values come from the CMS `home` singleton (page_home: years / countries /
 * faculty / sponsoredPct); the labels are site copy. The fallbacks below are
 * used verbatim when the CMS is unreachable or a field is blank, so the band
 * never renders empty.
 *
 * NOTE: these numbers are part of the approval list sent on 06-08 that is still
 * ⚠️ O CMS FOI ATUALIZADO EM 17-09 e passou a publicar 19 / 5 / 60+, seguindo
 * as correções da daily. Isso EXPÔS UM DEFEITO que só existia em potencial: o
 * VALOR vem do CMS e o RÓTULO vem daqui, e o rótulo de `countries` continuava
 * dizendo "Countries of global delivery". Com o valor em 5, a home e a Our
 * Impact publicaram "5 Countries of global delivery" — a firma dizendo que
 * entrega em cinco PAÍSES.
 *
 * A troca foi de UNIDADE, não de número: a About passou a contar por REGIÃO no
 * mesmo dia ("5 regions"), e o rótulo daqui tinha de acompanhar. Fica o aviso
 * para a próxima vez que um destes quatro mudar: valor e rótulo moram em lugares
 * diferentes, e mexer num sem olhar o outro publica uma frase errada.
 *
 * ⏳ A /approach ainda carrega `26 countries`, `95%` e `ten years`, que são
 * outros números para as mesmas coisas. Reconciliar é decisão da CDNA.
 */
export type SiteStat = { value: string; label: string };

/**
 * Order matters and is the brief's, not ours (item 2): "O 90% Chairman/CXO-
 * sponsored work deve aparecer antes de 18 years, porque é mais diferenciador
 * para nosso público." Guli's Our Impact mock puts 18 first, which is the one
 * place his layout and the e-mail disagree; the e-mail wins.
 */
/* ⚠️ OS FALLBACKS ACOMPANHARAM O CMS em 17-09 (eram 18 / 36 / 75). Eles só
   entram em cena quando o CMS está fora do ar ou o campo vem vazio — e era
   exatamente aí que o defeito ficava armado: com o CMS inacessível, a home
   voltaria a publicar os números velhos que a daily acabou de corrigir. */
const STAT_FALLBACK: (SiteStat & { cmsKey: string })[] = [
  { cmsKey: "sponsoredPct", value: "90%", label: "Work sponsored by Chairman / CXO" },
  { cmsKey: "years", value: "19", label: "Years advising senior leaders" },
  { cmsKey: "countries", value: "5", label: "Regions of global delivery" },
  { cmsKey: "faculty", value: "60+", label: "Faculty of senior practitioners" },
];

/**
 * Fetch the `home` singleton and merge its published values over the fallbacks.
 * A blank/missing field or an unreachable CMS keeps the fallback number.
 */
export async function getSiteStats(): Promise<SiteStat[]> {
  const home = await getPage("home");
  const data = (home?.data ?? {}) as Record<string, unknown>;
  return STAT_FALLBACK.map((s) => {
    const v = data[s.cmsKey];
    return {
      value: typeof v === "string" && v.trim() ? v : s.value,
      label: s.label,
    };
  });
}
