import { admin, db, sameOrigin, privateHeaders } from "../../../lib/server";
import { contentSchema } from "../../../lib/content-schema";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const draft = new URL(req.url).searchParams.get("draft") === "1";
    if (draft && !(await admin(req)))
      return new Response(null, { status: 401, headers: privateHeaders });
    const { data, error } = await db()
      .from("site_content")
      .select(draft ? "page,draft,published" : "page,published");
    if (error) throw error;
    return Response.json(data, { headers: privateHeaders });
  } catch {
    return Response.json(
      { error: "Database konten belum tersedia." },
      { status: 503, headers: privateHeaders },
    );
  }
}
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req) || !(await admin(req)))
      return new Response(null, { status: 403 });
    const text = await req.text();
    if (text.length > 12000) return new Response(null, { status: 413 });
    const parsed = contentSchema.safeParse(JSON.parse(text));
    if (!parsed.success)
      return Response.json({ error: "Konten tidak valid." }, { status: 400 });
    const { page, title, description, publish } = parsed.data;
    const value = { title, description };
    const client = db();
    const { data: existing, error: lookupError } = await client
      .from("site_content")
      .select("page")
      .eq("page", page)
      .maybeSingle();
    if (lookupError) throw lookupError;
    const changes = {
      draft: value,
      ...(publish ? { published: value } : {}),
      updated_at: new Date().toISOString(),
    };
    const { error } = existing
      ? await client.from("site_content").update(changes).eq("page", page)
      : await client.from("site_content").insert({ page, ...changes });
    if (error) throw error;
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch {
    return Response.json(
      { error: "Konten gagal disimpan." },
      { status: 503, headers: privateHeaders },
    );
  }
}
