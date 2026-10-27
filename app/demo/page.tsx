"use client";
import { useState } from "react";
const tabs = [
  "Dashboard CMS",
  "Login Admin",
  "Formulir Server",
  "Editor Konten",
];
export default function Demo() {
  const [tab, setTab] = useState(tabs[0]);
  const [title, setTitle] = useState("From Mineral to Beauty");
  const [description, setDescription] = useState(
    "Sericite Mica & Pearlescent Pigments untuk kebutuhan formulasi Anda.",
  );
  const [notice, setNotice] = useState("");
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img
            src="/assets/logo-sericite.png"
            width="63"
            height="63"
            alt="Logo Sericite Mica"
          />
          <strong>
            CMS Admin<small>Demo visual interaktif</small>
          </strong>
        </div>
        {tabs.map((t) => (
          <button
            key={t}
            aria-pressed={tab === t}
            onClick={() => {
              setTab(t);
              setNotice("");
            }}
          >
            {t}
          </button>
        ))}
        <a href="/">Lihat website ↗</a>
        <a href="/cms">CMS sebenarnya (perlu konfigurasi)</a>
      </aside>
      <section className="admin-content">
        <p className="demo-warning">
          <strong>DEMO TAMPILAN</strong> — data contoh. Tidak terhubung ke
          database, tidak mengirim email. Jangan masukkan password atau data
          pribadi asli.
        </p>
        <h1>{tab}</h1>
        {tab === tabs[0] && (
          <>
            <div className="admin-stats">
              {[
                ["Permintaan contoh", "12"],
                ["Produk contoh", "8"],
                ["Draft contoh", "3"],
                ["Dokumen contoh", "18"],
              ].map(([label, value]) => (
                <article key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </article>
              ))}
            </div>
            <div className="admin-heading">
              <h2>Log Permintaan — Contoh</h2>
              <button onClick={() => setTab(tabs[3])}>
                Edit Konten Website
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pemohon</th>
                    <th>Perusahaan</th>
                    <th>Dokumen</th>
                    <th>Status contoh</th>
                  </tr>
                </thead>
                <tbody>
                  {["COA, TDS", "MSDS", "Sampel Produk"].map((doc, i) => (
                    <tr key={doc}>
                      <td>Contoh Pemohon {i + 1}</td>
                      <td>PT Contoh {i + 1}</td>
                      <td>{doc}</td>
                      <td>
                        <span className="admin-badge">
                          {i === 0 ? "Baru" : "Diproses"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === tabs[1] && (
          <article className="card">
            <h2>Masuk ke CMS</h2>
            <p>Pratinjau layar login. Gunakan isian contoh saja.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTab(tabs[0]);
                setNotice("Simulasi masuk berhasil — bukan autentikasi nyata.");
              }}
            >
              <label>
                Email contoh
                <input
                  type="email"
                  defaultValue="admin@example.com"
                  required
                  autoComplete="off"
                />
              </label>
              <label>
                Password contoh
                <input
                  type="password"
                  placeholder="Password demo saja"
                  required
                  autoComplete="off"
                />
              </label>
              <button>Simulasikan Masuk</button>
            </form>
          </article>
        )}
        {tab === tabs[2] && (
          <div className="document-columns">
            <article className="contact-form-panel">
              <h2>Permintaan Dokumen &amp; Sampel</h2>
              <form
                className="contact-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setNotice(
                    "Simulasi selesai. Permintaan TIDAK disimpan dan email TIDAK dikirim.",
                  );
                }}
              >
                <label>
                  Nama contoh
                  <input required placeholder="Contoh Pemohon" />
                </label>
                <label>
                  Perusahaan contoh
                  <input required placeholder="PT Contoh" />
                </label>
                <label>
                  Email contoh
                  <input
                    type="email"
                    required
                    placeholder="pemohon@example.com"
                  />
                </label>
                <fieldset className="document-types">
                  <legend>Jenis Dokumen</legend>
                  {["COA", "MSDS", "TDS", "Sampel Produk"].map((x) => (
                    <label className="check" key={x}>
                      <input type="checkbox" />
                      {x}
                    </label>
                  ))}
                </fieldset>
                <label>
                  Detail Produk
                  <textarea
                    required
                    placeholder="Kode produk dan kebutuhan contoh"
                  />
                </label>
                <button>Simulasikan Kirim</button>
              </form>
            </article>
            <aside className="document-process">
              <span>PROSES CONTOH</span>
              <p>1. Isi formulir demo</p>
              <p>2. Lihat konfirmasi simulasi</p>
              <p>3. Tidak ada data dikirim ke server</p>
              <a href="/dokumen">Buka formulir aplikasi →</a>
            </aside>
          </div>
        )}
        {tab === tabs[3] && (
          <div className="demo-editor">
            <article className="card">
              <h2>Edit Konten Beranda</h2>
              <p>
                Ubah teks untuk langsung melihat pratinjau. Tidak mengubah
                website asli.
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <label>
                  Judul
                  <input
                    maxLength={300}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label>
                  Deskripsi
                  <textarea
                    rows={5}
                    maxLength={2000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setNotice(
                      "Simulasi draft. Perubahan hanya di layar dan hilang saat halaman dimuat ulang.",
                    )
                  }
                >
                  Simulasikan Simpan Draft
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNotice("Simulasi publikasi. Website asli TIDAK berubah.")
                  }
                >
                  Simulasikan Publikasikan
                </button>
              </form>
            </article>
            <article className="demo-preview">
              <small>PRATINJAU LANGSUNG — DEMO</small>
              <h2>{title}</h2>
              <p>{description}</p>
              <span className="button">Jelajahi Produk →</span>
            </article>
          </div>
        )}
        <p role="status" aria-live="polite">
          {notice}
        </p>
      </section>
    </main>
  );
}
