import { aboutCopyStore } from "@/lib/about-copy-server";
import { createCopyRoute } from "@/lib/page-copy/route";

/**
 * A API do editor `/edit-about`. O corpo do handler é a fábrica em
 * `lib/page-copy/route.ts`, compartilhada com `/api/home-copy` — inclusive a
 * caixa sobre NÃO HAVER AUTENTICAÇÃO, que continua valendo aqui.
 *
 * ⚠️ REVALIDA DUAS PÁGINAS. `/our-clients` publica os mesmos quatro números da
 * faixa da About desde 18-09 e lê a mesma copy desde 23-09 (`getFirmStats()`,
 * em `lib/stats.ts`). Sem a segunda linha, a cliente corrigiria "19 years" na
 * About e veria o número velho na Clients & Impact até o cache expirar — que é
 * exatamente a divergência que juntar as duas listas foi feito para impedir.
 */
export const dynamic = "force-dynamic";

export const { GET, POST } = createCopyRoute({
  key: "about",
  store: aboutCopyStore,
  revalidate: ["/about", "/our-clients"],
});
