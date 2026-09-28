import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { servicePagesCopyStore } from "@/lib/service-pages-copy-server";
import { serviceCopySchemaFor } from "@/lib/service-pages-copy-schema";
import { services } from "@/lib/services";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  const { slug } = await params;
  if (!serviceCopySchemaFor(slug)) return NextResponse.json({ error: "Unknown service" }, { status: 404 });
  const copy = await servicePagesCopyStore.read();
  return NextResponse.json(copy.bySlug[slug], { headers: { "cache-control": "no-store" } });
}

export async function POST(req: NextRequest, { params }: Context) {
  const { slug } = await params;
  const schema = serviceCopySchemaFor(slug);
  if (!schema) return NextResponse.json({ error: "Unknown service" }, { status: 404 });
  let input: unknown;
  try { input = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Some fields are invalid", issues: parsed.error.issues }, { status: 422 });
  try {
    // Read the other services when saving, rather than sending the editor's old snapshot.
    const current = await servicePagesCopyStore.read();
    const saved = await servicePagesCopyStore.save({ ...current, bySlug: { ...current.bySlug, [slug]: parsed.data } });
    revalidateTag(servicePagesCopyStore.tag, { expire: 0 });
    revalidatePath("/services");
    for (const service of services) revalidatePath(`/services/${service.slug}`);
    return NextResponse.json({ ok: true, copy: saved.bySlug[slug] });
  } catch (error) {
    console.error(`[service-pages-copy:${slug}] save failed:`, error);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
  }
}
