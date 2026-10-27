import Link from "next/link";
import { db } from "../../lib/server";
export const dynamic = "force-dynamic";
export default async function Catalog() {
  let products: { id: string; name: string; description: string }[] = [];
  let unavailable = false;
  try {
    const { data, error } = await db()
      .from("products")
      .select("id,name,description")
      .eq("published", true)
      .order("name");
    if (error) throw error;
    products = data ?? [];
  } catch {
    unavailable = true;
  }
  return (
    <main className="contact-page">
      <div className="contact-intro">
        <div className="contact-container">
          <h1>Katalog Database</h1>
          <p>Produk yang dipublikasikan melalui CMS.</p>
        </div>
      </div>
      <section>
        {unavailable ? (
          <p>Katalog database belum tersedia.</p>
        ) : products.length ? (
          products.map((p) => (
            <article className="card" key={p.id}>
              <h2>{p.name}</h2>
              <p>{p.description}</p>
              <Link href="/dokumen">Minta Dokumen &amp; Sampel</Link>
            </article>
          ))
        ) : (
          <p>Produk sedang disiapkan.</p>
        )}
      </section>
    </main>
  );
}
