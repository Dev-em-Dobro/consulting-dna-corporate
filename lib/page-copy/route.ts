import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import type { CopyStore } from "./store.ts";

/**
 * A API de um editor de página: GET devolve a copy em vigor (padrão + salvo),
 * POST valida, grava e manda as páginas afetadas regenerarem.
 *
 * ⚠️ SEM AUTENTICAÇÃO, de propósito e por pedido (23-09): a cliente entra e
 * salva sem login. É a mesma exposição de qualquer formulário público — quem
 * souber a URL troca o texto do site. Aceito como provisório até o CMS assumir;
 * se precisar fechar antes disso, o lugar é aqui, checando um segredo no header
 * — uma vez, para as duas rotas, que é metade do motivo de esta fábrica existir.
 *
 * ⚠️ `revalidate` É UMA LISTA, e não o caminho da própria página. A copy da
 * About alimenta TAMBÉM a faixa "By the numbers" da Clients & Impact (os quatro
 * números são a mesma fonte desde 18-09 — ver `lib/stats.ts`). Revalidar só
 * `/about` deixaria a outra página publicando o número velho até o cache dela
 * expirar sozinho, que é exatamente a divergência que juntar as duas listas foi
 * feito para impedir.
 */
export function createCopyRoute<T>({
  key,
  store,
  revalidate,
}: {
  key: string;
  store: CopyStore<T>;
  revalidate: string[];
}) {
  return {
    async GET() {
      return NextResponse.json(await store.read(), { headers: { "cache-control": "no-store" } });
    },
    async POST(req: NextRequest) {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
      try {
        const saved = await store.save(body);
        // As páginas são estáticas e regeneram na próxima visita; sem isto, o
        // salvo só apareceria quando o cache expirasse.
        for (const p of revalidate) revalidatePath(p);
        return NextResponse.json({ ok: true, copy: saved });
      } catch (err) {
        if (err instanceof ZodError) {
          return NextResponse.json({ error: "Some fields are invalid", issues: err.issues }, { status: 422 });
        }
        console.error(`[${key}-copy] save failed:`, err);
        return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
      }
    },
  };
}
