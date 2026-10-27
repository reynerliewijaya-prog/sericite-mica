import { admin, db, sameOrigin, privateHeaders } from "../../../lib/server";
import { productSchema } from "../../../lib/validation";
export const runtime = "nodejs";
export async function GET(req: Request) {
  try {
    if (!(await admin(req))) return new Response(null, { status: 401 });
    const client = db();
    const [inquiries, products] = await Promise.all([
      client
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      client
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    if (inquiries.error || products.error) throw Error();
    return Response.json(
      { inquiries: inquiries.data, products: products.data },
      { headers: privateHeaders },
    );
  } catch {
    return Response.json(
      { error: "CMS tidak tersedia." },
      { status: 503, headers: privateHeaders },
    );
  }
}
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req) || !(await admin(req)))
      return new Response(null, { status: 403 });
    const text = await req.text();
    if (text.length > 16000) return new Response(null, { status: 413 });
    const parsed = productSchema.safeParse(JSON.parse(text));
    if (!parsed.success)
      return Response.json(
        { error: "Data produk tidak valid." },
        { status: 400 },
      );
    const { error } = await db().from("products").insert(parsed.data);
    if (error) throw error;
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch {
    return Response.json({ error: "Produk gagal disimpan." }, { status: 503 });
  }
}
export async function DELETE(req: Request) {
  try {
    if (!sameOrigin(req) || !(await admin(req)))
      return new Response(null, { status: 403 });
    const id = new URL(req.url).searchParams.get("id");
    if (!id || !/^[0-9a-f-]{36}$/i.test(id))
      return new Response(null, { status: 400 });
    const { error } = await db()
      .from(
        new URL(req.url).searchParams.get("kind") === "inquiry"
          ? "inquiries"
          : "products",
      )
      .delete()
      .eq("id", id);
    if (error) throw error;
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch {
    return new Response(null, { status: 503 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!sameOrigin(req) || !(await admin(req)))
      return new Response(null, { status: 403 });
    const id = new URL(req.url).searchParams.get("id");
    if (!id || !/^[0-9a-f-]{36}$/i.test(id))
      return new Response(null, { status: 400 });
    const text = await req.text();
    if (text.length > 16000) return new Response(null, { status: 413 });
    const parsed = productSchema.safeParse(JSON.parse(text));
    if (!parsed.success) return new Response(null, { status: 400 });
    const { error } = await db()
      .from("products")
      .update(parsed.data)
      .eq("id", id);
    if (error) throw error;
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch {
    return new Response(null, { status: 503 });
  }
}
