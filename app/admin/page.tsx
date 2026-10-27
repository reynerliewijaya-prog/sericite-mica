"use client";
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
  ) {
    const {
      data: { session },
    } = await auth().auth.getSession();
    if (!session) throw Error("Silakan login kembali.");
    const response = await fetch(
      "/api/admin" +
        (id
          ? "?id=" + encodeURIComponent(id) + (kind ? "&kind=" + kind : "")
          : ""),
      {
        method,
        cache: "no-store",
        headers: {
          Authorization: "Bearer " + session.access_token,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      },
    );
    if (!response.ok) throw Error("Akses ditolak atau layanan belum tersedia.");
    return response.json();
  }
  async function load() {
    setData(await call());
  }
  return (
    <main>
      <section>
        <span className="eyebrow">AREA TERBATAS</span>
        <h1>CMS Admin</h1>
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
            <h2>100 Permintaan Terbaru</h2>
            {data.inquiries.map((i) => (
              <article className="card" key={i.id}>
                <h3>
                  {i.name} · {i.company}
                </h3>
                <p>{i.email}</p>
                <time>{i.created_at}</time>
                <p className="message">{i.message}</p>
                <small>
                  Email notifikasi: {i.notified ? "terkirim" : "belum terkirim"}
                </small>
                <p>
                  <button
                    onClick={async () => {
                      if (!confirm("Hapus permanen permintaan ini?")) return;
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
        <p role="status">{status}</p>
      </section>
    </main>
  );
}
