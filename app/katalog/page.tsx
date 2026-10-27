import Link from "next/link";
import { db } from "../../lib/server";
export const dynamic = "force-dynamic";
export default async function Catalog() {
  let products: {
    id: string;
    name: string;
    series: string;
    description: string;
  }[] = [];
  let unavailable = false;
  try {
    const { data, error } = await db()
      .from("products")
      .select("id,name,series,description")
      .eq("published", true)
      .order("name");
    if (error) throw error;
    products = data ?? [];
  } catch {
    unavailable = true;
  }
  return (
    <main>
      <section>
        <span className="eyebrow">KATALOG PRODUK</span>
        <h1>Temukan material Anda.</h1>
        <p>Spesifikasi teknis dan ketersediaan dikonfirmasi oleh tim kami.</p>
        {unavailable ? (
          <p role="status">
            Katalog belum tersedia. Hubungi kami untuk informasi produk.
          </p>
        ) : !products.length ? (
          <p>Produk sedang disiapkan.</p>
        ) : (
          <div className="grid">
            {products.map((p) => (
              <article className="card" key={p.id}>
                <span>{p.series}</span>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <Link href="/kontak">Minta spesifikasi →</Link>
              </article>
            ))}
          </div>
        )}
        <Link className="button" href="/kontak">
          Hubungi Tim Kami
        </Link>
      </section>
    </main>
  );
}
