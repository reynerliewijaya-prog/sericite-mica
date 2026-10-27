"use client";
import ContentEditor from "./content-editor";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useRef, useState } from "react";
type Product = {
  id: string;
  name: string;
  series: string;
  description: string;
  published: boolean;
};
type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  created_at: string;
  notified: boolean;
};
export default function Admin() {
  const [tab, setTab] = useState("inquiries");
  const client = useRef<SupabaseClient | null>(null);
  const [data, setData] = useState<{
    products: Product[];
    inquiries: Inquiry[];
  } | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  function auth() {
    if (!client.current) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
        key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) throw Error("Login belum dikonfigurasi.");
      client.current = createClient(url, key, {
        auth: { persistSession: false, detectSessionInUrl: false },
      });
    }
    return client.current;
  }
  async function call(
    method = "GET",
    body?: unknown,
    id?: string,
    kind?: string,
    content = false,
    media = false,
  ) {
    const {
      data: { session },
    } = await auth().auth.getSession();
    if (!session) throw Error("Silakan login kembali.");
    const response = await fetch(
      (media
        ? "/api/media"
        : content
          ? "/api/content" + (method === "GET" ? "?draft=1" : "")
          : "/api/admin") +
        (id
          ? "?id=" + encodeURIComponent(id) + (kind ? "&kind=" + kind : "")
          : ""),
      {
        method,
        cache: "no-store",
        headers: {
          Authorization: "Bearer " + session.access_token,
          ...(body instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
        },
        body:
          body instanceof FormData
            ? body
            : body
              ? JSON.stringify(body)
              : undefined,
      },
    );
    if (!response.ok) throw Error("Akses ditolak atau layanan belum tersedia.");
    return response.json();
  }
  async function load() {
    setData(await call());
  }
  return (
    <main className="admin-shell sericite-studio">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img
            src="/assets/logo-sericite.png"
            alt="Logo Sericite Mica"
            width="63"
            height="63"
          />
          <strong>
            SERICITE<small>CONTENT STUDIO</small>
          </strong>
        </div>
        {[
          ["inquiries", "Log Permintaan"],
          ["products", "Katalog Produk"],
          ["documents", "Dokumen PDF"],
          ["surface", "Surface Treatment"],
          ["settings", "Pengaturan"],
          ["content", "Editor Konten"],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
        <a href="/">Lihat website ↗</a>
      </aside>
      <section className="admin-content">
        <span className="eyebrow">AREA TERBATAS</span>
        <h1>
          {!data
            ? "Selamat datang di Sericite Studio"
            : (
                {
                  inquiries: "Log Permintaan",
                  products: "Katalog Produk",
                  documents: "Dokumen PDF",
                  surface: "Surface Treatment",
                  settings: "Pengaturan",
                  content: "Editor Konten",
                } as Record<string, string>
              )[tab]}
        </h1>
        <p>
          Jangan gunakan akun bersama. Akses hanya untuk admin yang telah
          diverifikasi.
        </p>
        {!data ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              const f = new FormData(e.currentTarget);
              try {
                const { error } = await auth().auth.signInWithPassword({
                  email: String(f.get("email")),
                  password: String(f.get("password")),
                });
                if (error) throw Error("Email atau password tidak valid.");
                await load();
                setStatus("");
              } catch (err) {
                setStatus((err as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </label>
            <button disabled={busy}>Masuk</button>
          </form>
        ) : (
          <>
            <button
              onClick={async () => {
                await auth().auth.signOut();
                setData(null);
                setStatus("Anda telah keluar.");
              }}
            >
              Keluar
            </button>
            <div className="admin-stats">
              <article>
                <small>Permintaan dimuat (maks. 100)</small>
                <strong>{data.inquiries.length}</strong>
              </article>
              <article>
                <small>Notifikasi belum terkirim</small>
                <strong>
                  {data.inquiries.filter((i) => !i.notified).length}
                </strong>
              </article>
              <article>
                <small>Produk dipublikasikan</small>
                <strong>
                  {data.products.filter((p) => p.published).length}
                </strong>
              </article>
              <article>
                <small>Produk draft</small>
                <strong>
                  {data.products.filter((p) => !p.published).length}
                </strong>
              </article>
            </div>
            {tab === "products" && (
              <>
                <h2>{editing ? "Ubah Produk" : "Tambah Produk"}</h2>
                <form
                  key={editing?.id ?? "new"}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget,
                      f = new FormData(form);
                    setBusy(true);
                    try {
                      await call(
                        editing ? "PUT" : "POST",
                        {
                          name: f.get("name"),
                          series: f.get("series"),
                          description: f.get("description"),
                          published: f.get("published") === "on",
                        },
                        editing?.id,
                      );
                      await load();
                      form.reset();
                      setEditing(null);
                      setStatus("Produk tersimpan.");
                    } catch (err) {
                      setStatus((err as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <label>
                    Nama
                    <input
                      defaultValue={editing?.name ?? ""}
                      name="name"
                      required
                      minLength={2}
                      maxLength={160}
                    />
                  </label>
                  <label>
                    Seri
                    <input
                      defaultValue={editing?.series ?? ""}
                      name="series"
                      required
                      maxLength={80}
                    />
                  </label>
                  <label>
                    Deskripsi
                    <textarea
                      defaultValue={editing?.description ?? ""}
                      name="description"
                      required
                      minLength={10}
                      maxLength={4000}
                    />
                  </label>
                  <label className="check">
                    <input
                      defaultChecked={editing?.published ?? false}
                      name="published"
                      type="checkbox"
                    />
                    Publikasikan
                  </label>
                  <button disabled={busy}>Simpan Produk</button>
                  {editing && (
                    <button type="button" onClick={() => setEditing(null)}>
                      Batal
                    </button>
                  )}
                </form>
                <div className="grid">
                  {data.products.map((p) => (
                    <article className="card" key={p.id}>
                      <h3>{p.name}</h3>
                      <p>{p.published ? "Publik" : "Draft"}</p>
                      <button onClick={() => setEditing(p)}>Ubah</button>{" "}
                      <button
                        onClick={async () => {
                          if (!confirm("Hapus produk ini?")) return;
                          try {
                            await call("DELETE", undefined, p.id);
                            await load();
                          } catch {
                            setStatus("Penghapusan gagal.");
                          }
                        }}
                      >
                        Hapus
                      </button>
                    </article>
                  ))}
                </div>
              </>
            )}
            {tab === "content" && (
              <ContentEditor
                upload={async (file) => {
                  const f = new FormData();
                  f.append("file", file);
                  const result = await call(
                    "POST",
                    f,
                    undefined,
                    undefined,
                    false,
                    true,
                  );
                  return result.url;
                }}
                request={(method, body) =>
                  call(method, body, undefined, undefined, true)
                }
              />
            )}
            {tab === "documents" && (
              <article className="card">
                <h2>Unggah dokumen PDF</h2>
                <div className="admin-dropzone">
                  Penyimpanan dan unggah PDF belum dikonfigurasi.
                </div>
                <p>
                  Belum tersedia pemetaan PDF ke kode produk. Jangan unggah
                  dokumen rahasia sebelum kontrol akses file diterapkan.
                </p>
              </article>
            )}
            {tab === "surface" && (
              <article className="card">
                <h2>Surface Treatment</h2>
                <p>
                  Desain halaman ini dikelola melalui kode website, belum
                  melalui CMS.
                </p>
                <a href="/surface">Lihat halaman →</a>
              </article>
            )}
            {tab === "settings" && (
              <article className="card">
                <h2>Pengaturan</h2>
                <p>Email notifikasi: serciteindo@gmail.com</p>
                <p>
                  Konfigurasi autentikasi, database, dan layanan email dikelola
                  melalui environment server. Kredensial tidak ditampilkan di
                  CMS.
                </p>
              </article>
            )}
            {tab === "inquiries" && (
              <>
                <div className="admin-heading">
                  <h2>100 Permintaan Terbaru</h2>
                  <button onClick={() => setTab("products")}>
                    + Tambah Kode Produk
                  </button>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Pemohon</th>
                        <th>Perusahaan</th>
                        <th>Permintaan / produk target</th>
                        <th>Notifikasi email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.inquiries.map((i) => (
                        <tr key={i.id}>
                          <td>
                            <strong>{i.name}</strong>
                            <br />
                            <small>{i.email}</small>
                            <br />
                            <small>
                              {new Date(i.created_at).toLocaleDateString(
                                "id-ID",
                              )}
                            </small>
                          </td>
                          <td>{i.company || "—"}</td>
                          <td>
                            <details>
                              <summary>Lihat permintaan</summary>
                              <p className="message">{i.message}</p>
                            </details>
                          </td>
                          <td>
                            <span
                              className={
                                i.notified ? "admin-badge sent" : "admin-badge"
                              }
                            >
                              {i.notified ? "Terkirim" : "Belum terkirim"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!data.inquiries.length && (
                    <p className="admin-empty">Belum ada permintaan.</p>
                  )}
                </div>
                <article className="card">
                  <h3>Notifikasi inquiry</h3>
                  <p>
                    Permintaan yang berhasil disimpan dapat dilihat di log ini.
                    Pengiriman notifikasi ke serciteindo@gmail.com memerlukan
                    konfigurasi layanan email.
                  </p>
                </article>
                <h2>Kelola Permintaan</h2>
                {data.inquiries.map((i) => (
                  <article className="card" key={i.id}>
                    <h3>
                      {i.name} · {i.company}
                    </h3>
                    <p>{i.email}</p>
                    <time>{i.created_at}</time>
                    <p className="message">{i.message}</p>
                    <small>
                      Email notifikasi:{" "}
                      {i.notified ? "terkirim" : "belum terkirim"}
                    </small>
                    <p>
                      <button
                        onClick={async () => {
                          if (!confirm("Hapus permanen permintaan ini?"))
                            return;
                          try {
                            await call("DELETE", undefined, i.id, "inquiry");
                            await load();
                          } catch {
                            setStatus("Penghapusan gagal.");
                          }
                        }}
                      >
                        Hapus Permintaan
                      </button>
                    </p>
                  </article>
                ))}
              </>
            )}
          </>
        )}
        <p role="status">{status}</p>
      </section>
    </main>
  );
}
