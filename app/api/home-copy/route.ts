import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getHomeCopy, saveHomeCopy } from "@/lib/home-copy-server";

/**
 * A API do editor `/edit-home`: GET devolve a copy em vigor (padrão + salvo),
 * POST valida, grava e manda a home regenerar.
 *
 * ⚠️ SEM AUTENTICAÇÃO, de propósito e por pedido (23-09): a cliente entra e
 * salva sem login. É a mesma exposição de qualquer formulário público — quem
 * souber a URL troca o texto da home. Aceito como provisório até o CMS assumir;
 * se precisar fechar antes disso, o lugar é aqui, checando um segredo no header.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getHomeCopy(), { headers: { "cache-control": "no-store" } });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const saved = await saveHomeCopy(body);
    // A home é estática e regenera na próxima visita; sem isto, o salvo só
    // apareceria quando o cache expirasse.
    revalidatePath("/");
    return NextResponse.json({ ok: true, copy: saved });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Some fields are invalid", issues: err.issues }, { status: 422 });
    }
    console.error("[home-copy] save failed:", err);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
  }
}
