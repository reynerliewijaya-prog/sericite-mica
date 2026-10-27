"use client";
import { useState } from "react";
import defaults from "../../lib/content-defaults.json";
type Fields = {
  title: string;
  description: string;
  image?: string;
  gallery?: string[];
};
export default function ContentEditor({
  request,
  upload,
}: {
  upload: (file: File) => Promise<string>;
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
        Edit judul, deskripsi, gambar utama, dan galeri halaman. Simpan draft
        untuk meninjau sebelum menerbitkan. Data dan media khusus Sericite.
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
        <section className="studio-media">
          <h3>Gambar halaman</h3>
          {fields.image && (
            <img src={fields.image} alt="Preview gambar utama" />
          )}
          <label>
            URL gambar utama
            <input
              value={fields.image || ""}
              placeholder="https://…"
              onChange={(e) => setFields({ ...fields, image: e.target.value })}
            />
          </label>
          <label>
            Upload gambar utama
            <input
              type="file"
              disabled={busy}
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setBusy(true);
                upload(file)
                  .then((url) => {
                    setFields((v) => ({ ...v, image: url }));
                    setStatus("Gambar masuk draft. Simpan atau publikasikan.");
                  })
                  .catch(() =>
                    setStatus("Upload gagal. Periksa Storage Sericite."),
                  )
                  .finally(() => setBusy(false));
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => setFields({ ...fields, image: "" })}
          >
            Hapus pilihan gambar
          </button>
          <h3>Galeri gambar</h3>
          <p>
            PNG/JPEG/WebP maksimal 3 MB per gambar. Maksimal 12 gambar, bersifat
            publik.
          </p>
          <label>
            Tambah gambar
            <input
              type="file"
              multiple
              disabled={busy}
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                e.target.value = "";
                if (files.length + (fields.gallery?.length || 0) > 12) {
                  setStatus("Maksimal 12 gambar.");
                  return;
                }
                setBusy(true);
                (async () => {
                  try {
                    for (const file of files) {
                      const url = await upload(file);
                      setFields((v) => ({
                        ...v,
                        gallery: [...(v.gallery || []), url],
                      }));
                    }
                    setStatus("Gambar ditambahkan ke draft.");
                  } catch {
                    setStatus(
                      "Sebagian upload gagal. Gambar berhasil tetap berada di draft.",
                    );
                  } finally {
                    setBusy(false);
                  }
                })();
              }}
            />
          </label>
          <div className="studio-gallery">
            {(fields.gallery || []).map((url, i) => (
              <figure key={url + i}>
                <img src={url} alt={"Galeri " + (i + 1)} />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    setFields({
                      ...fields,
                      gallery: fields.gallery?.filter((_, j) => i !== j),
                    })
                  }
                >
                  Hapus gambar {i + 1}
                </button>
              </figure>
            ))}
          </div>
        </section>
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
