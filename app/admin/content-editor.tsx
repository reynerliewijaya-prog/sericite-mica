"use client";
import { useState } from "react";
import defaults from "../../lib/content-defaults.json";
type Fields = { title: string; description: string };
export default function ContentEditor({
  request,
}: {
  request: (method: string, body?: unknown) => Promise<unknown>;
}) {
  const [page, setPage] = useState<keyof typeof defaults>("index");
  const [fields, setFields] = useState<Fields>(defaults.index);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function load(selected: keyof typeof defaults) {
    setPage(selected);
    setFields({
      title: defaults[selected].title,
      description: (defaults[selected] as Partial<Fields>).description ?? "",
    });
    setBusy(true);
    try {
      const rows = (await request("GET")) as { page: string; draft: Fields }[];
      const row = rows.find((r) => r.page === selected);
      if (row) setFields(row.draft);
      setStatus("Draft dimuat.");
    } catch {
      setStatus(
        "Draft belum dapat dimuat. Nilai desain asli ditampilkan; periksa database sebelum menyimpan.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="card">
      <h2>Editor Konten Website</h2>
      <p>
        Edit judul dan deskripsi utama halaman ZIP. Tidak mengubah susunan,
        warna, formulir, atau data katalog. Draft tidak terlihat oleh
        pengunjung.
      </p>
      <label>
        Halaman
        <select
          value={page}
          disabled={busy}
          onChange={(e) => load(e.target.value as keyof typeof defaults)}
        >
          {Object.keys(defaults).map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <button disabled={busy} onClick={() => load(page)}>
        Muat draft tersimpan
      </button>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Judul
          <input
            value={fields.title}
            maxLength={300}
            onChange={(e) => setFields({ ...fields, title: e.target.value })}
          />
        </label>
        <label>
          Deskripsi
          <textarea
            rows={5}
            maxLength={2000}
            value={fields.description}
            onChange={(e) =>
              setFields({ ...fields, description: e.target.value })
            }
          />
        </label>
        <div className="card">
          <small>PRATINJAU TEKS — bukan tampilan persis halaman</small>
          <h2>{fields.title}</h2>
          <p>{fields.description}</p>
        </div>
        {[false, true].map((publish) => (
          <button
            key={String(publish)}
            type="button"
            disabled={busy || !fields.title.trim()}
            onClick={async () => {
              if (
                publish &&
                !confirm(
                  "Publikasikan judul dan deskripsi ini untuk semua pengunjung?",
                )
              )
                return;
              setBusy(true);
              try {
                await request("POST", { page, ...fields, publish });
                setStatus(
                  publish
                    ? "Konten dipublikasikan. Muat ulang halaman website untuk melihatnya."
                    : "Draft tersimpan, belum dipublikasikan.",
                );
              } catch {
                setStatus(
                  "Gagal menyimpan. Periksa login dan konfigurasi database.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {publish ? "Publikasikan" : "Simpan Draft"}
          </button>
        ))}
      </form>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"/desain/" + page + ".html"}
      >
        Buka halaman website ↗
      </a>
      <p role="status">{status}</p>
    </article>
  );
}
