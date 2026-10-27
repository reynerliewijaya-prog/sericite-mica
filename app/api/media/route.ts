import {
  db,
  admin as isAdmin,
  sameOrigin,
  privateHeaders,
} from "../../../lib/server";
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req) || !(await isAdmin(req)))
      return new Response(null, { status: 403, headers: privateHeaders });
    if (Number(req.headers.get("content-length") || 0) > 3_300_000)
      return Response.json({ error: "Maksimal 3 MB." }, { status: 413 });
    const f = (await req.formData()).get("file");
    if (!(f instanceof File) || f.size > 3_000_000 || f.size === 0)
      return Response.json(
        { error: "Pilih gambar maksimal 3 MB." },
        { status: 400 },
      );
    const bytes = new Uint8Array(await f.arrayBuffer());
    const png =
      bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
    const jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const webp =
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
    const ext = png ? "png" : jpg ? "jpg" : webp ? "webp" : null;
    if (!ext)
      return Response.json(
        { error: "Hanya PNG, JPEG, atau WebP asli." },
        { status: 400 },
      );
    const c = db();
    const bucket = "sericite-media";
    const { data: existing, error: lookup } = await c.storage.getBucket(bucket);
    if (!existing) {
      const { error } = await c.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 3000000,
        allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
      });
      if (error) throw error;
    } else if (lookup || !existing.public) throw Error();
    const path = crypto.randomUUID() + "." + ext;
    const { error } = await c.storage.from(bucket).upload(path, bytes, {
      contentType: png ? "image/png" : jpg ? "image/jpeg" : "image/webp",
      upsert: false,
    });
    if (error) throw error;
    return Response.json(
      { url: c.storage.from(bucket).getPublicUrl(path).data.publicUrl },
      { headers: privateHeaders },
    );
  } catch {
    return Response.json(
      {
        error:
          "Upload belum tersedia. Periksa akses Storage Supabase Sericite.",
      },
      { status: 503, headers: privateHeaders },
    );
  }
}
