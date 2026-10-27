"use client";
import Script from "next/script";
import Link from "next/link";
import { useRef, useState } from "react";
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id: string) => void;
    };
  }
}
export default function Inquiry({
  documents = false,
}: {
  documents?: boolean;
}) {
  const [picked, setPicked] = useState<string[]>(["COA"]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  function mount() {
    if (
      box.current &&
      window.turnstile &&
      siteKey &&
      widget.current === undefined
    )
      widget.current = window.turnstile.render(box.current, {
        sitekey: siteKey,
        action: "inquiry",
        callback: (v: string) => setToken(v),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
  }
  return (
    <form
      className={documents ? "contact-form document-form" : "contact-form"}
      onSubmit={async (e) => {
        e.preventDefault();
        if (documents && picked.length === 0) {
          setStatus("Pilih minimal satu jenis dokumen.");
          return;
        }
        setBusy(true);
        setStatus("Menyimpan…");
        const form = e.currentTarget;
        const values = new FormData(form);
        try {
          const res = await fetch("/api/inquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: values.get("name"),
              email: values.get("email"),
              company: documents ? values.get("company") : "",
              message: values.get("message"),
              ...(documents
                ? { phone: values.get("phone"), documents: picked }
                : {}),
              website: values.get("website"),
              consent: values.get("consent") === "on",
              token,
            }),
          });
          const data = await res.json();
          setStatus(data.message ?? data.error);
          if (res.ok) form.reset();
        } catch {
          setStatus("Koneksi gagal. Periksa koneksi sebelum mencoba lagi.");
        } finally {
          setBusy(false);
          setToken("");
          if (widget.current) window.turnstile?.reset(widget.current);
        }
      }}
    >
      {!documents && <h2>Kirim pesan</h2>}
      <label>
        <span>
          Nama Lengkap{" "}
          <b className="required-mark" aria-hidden="true">
            *
          </b>
        </span>
        <input
          name="name"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
        />
      </label>
      {documents && (
        <label>
          Perusahaan <span className="required-mark">*</span>
          <input
            name="company"
            required
            maxLength={160}
            autoComplete="organization"
          />
        </label>
      )}
      <label>
        <span>
          Email Perusahaan{" "}
          <b className="required-mark" aria-hidden="true">
            *
          </b>
        </span>
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
      </label>
      {documents && (
        <>
          <label>
            Nomor HP / WhatsApp <span className="required-mark">*</span>
            <input
              name="phone"
              type="tel"
              required
              minLength={6}
              maxLength={40}
              autoComplete="tel"
            />
          </label>
          <fieldset className="document-types">
            <legend>
              Jenis Dokumen yang Dibutuhkan{" "}
              <span className="required-mark">*</span>
            </legend>
            <div>
              {[
                "COA",
                "MSDS",
                "TDS",
                "Spesifikasi Produk",
                "Sampel Produk",
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={picked.includes(type)}
                  onClick={() =>
                    setPicked(
                      picked.includes(type)
                        ? picked.filter((x) => x !== type)
                        : [...picked, type],
                    )
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </fieldset>
        </>
      )}
      <label className={documents ? "document-details" : undefined}>
        <span>
          {documents ? "Detail Produk Target" : "Pesan"}{" "}
          <b className="required-mark" aria-hidden="true">
            *
          </b>
        </span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={documents ? 4 : 5}
          placeholder={
            documents
              ? "Kode produk, jumlah sampel, dan aplikasi formula"
              : undefined
          }
        />
      </label>
      <div className="trap" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="check">
        <input name="consent" type="checkbox" required /> Saya menyetujui
        pemrosesan data sesuai <Link href="/privasi">kebijakan privasi</Link>.
      </label>
      <div ref={box} />
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          onReady={mount}
        />
      ) : (
        <p role="status">
          Formulir belum aktif: verifikasi keamanan belum dikonfigurasi.
        </p>
      )}
      <div className="contact-submit">
        <small>
          Verifikasi keamanan menggunakan Cloudflare Turnstile. Jangan sertakan
          data rahasia dalam pesan.
        </small>
        <button disabled={busy || !token}>
          {busy ? "Menyimpan…" : documents ? "Kirim Permintaan" : "Kirim Pesan"}
        </button>
      </div>
      <p role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
