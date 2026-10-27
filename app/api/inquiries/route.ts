import { inquirySchema } from "../../../lib/validation";
import { db, env, sameOrigin, privateHeaders } from "../../../lib/server";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req))
      return Response.json({ error: "Permintaan ditolak." }, { status: 403 });
    const text = await req.text();
    if (text.length > 16000) return new Response(null, { status: 413 });
    const parsed = inquirySchema.safeParse(JSON.parse(text));
    if (!parsed.success)
      return Response.json(
        { error: "Periksa isian dan persetujuan Anda." },
        { status: 400 },
      );
    const { token, website, consent, phone, documents, ...input } = parsed.data;
    if (documents && (!phone || !input.company.trim()))
      return Response.json(
        { error: "Perusahaan dan nomor telepon wajib diisi." },
        { status: 400 },
      );
    if (documents)
      input.message = `Jenis permintaan: ${documents.join(", ")}\nTelepon: ${phone}\n\n${input.message}`;
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: env("TURNSTILE_SECRET_KEY"),
          response: token,
        }),
        signal: AbortSignal.timeout(10000),
      },
    ).then((r) => r.json());
    if (
      !verification.success ||
      verification.hostname !== new URL(env("APP_ORIGIN")).hostname ||
      verification.action !== "inquiry"
    )
      return Response.json(
        { error: "Verifikasi keamanan gagal. Muat ulang formulir." },
        { status: 400 },
      );
    const client = db();
    const { data: record, error } = await client
      .from("inquiries")
      .insert({ ...input, consent_at: new Date().toISOString() })
      .select("id")
      .single();
    if (error) throw error;
    let notified = false;
    try {
      const result = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env("RESEND_API_KEY")}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `inquiry/${record.id}`,
        },
        body: JSON.stringify({
          from: env("EMAIL_FROM"),
          to: ["serciteindo@gmail.com"],
          reply_to: input.email,
          subject: "Permintaan baru dari website Sericite Mica",
          text: `Permintaan ${record.id} telah disimpan. Buka CMS admin untuk melihat isinya.`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      notified = result.ok;
    } catch {}
    if (notified)
      await client
        .from("inquiries")
        .update({ notified: true })
        .eq("id", record.id);
    return Response.json(
      {
        message: notified
          ? "Permintaan tersimpan dan notifikasi email terkirim."
          : "Permintaan tersimpan. Notifikasi email belum terkirim; admin dapat melihatnya di CMS.",
      },
      { status: 201, headers: privateHeaders },
    );
  } catch {
    return Response.json(
      {
        error:
          "Layanan belum tersedia. Jangan kirim ulang jika sudah mendapat konfirmasi tersimpan.",
      },
      { status: 503, headers: privateHeaders },
    );
  }
}
