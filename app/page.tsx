import Link from "next/link";
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <span className="eyebrow">MINERAL · MATERIAL · INOVASI</span>
          <h1>
            Kilau alami.
            <br />
            Presisi untuk
            <br />
            <em>setiap formulasi.</em>
          </h1>
          <p>
            Sericite mica dan pearlescent pigments untuk kebutuhan kosmetik,
            pelapis, plastik, dan aplikasi industri.
          </p>
          <Link className="button" href="/katalog">
            Jelajahi Produk →
          </Link>{" "}
          <Link className="outline" href="/kontak">
            Konsultasi & Sampel
          </Link>
        </div>
        <div className="mineral" aria-hidden="true">
          ✧
          <small>
            SERICITE MICA
            <br />
            PEARLESCENT PIGMENTS
          </small>
        </div>
      </section>
      <section>
        <span className="eyebrow">SOLUSI MATERIAL</span>
        <h2>
          Material yang tepat.
          <br />
          Hasil yang berbeda.
        </h2>
        <div className="grid">
          {["Sericite Mica", "Pearlescent Pigments", "Surface Treatment"].map(
            (x, i) => (
              <Link
                className="card"
                key={x}
                href={i === 2 ? "/surface" : "/katalog"}
              >
                <span>0{i + 1}</span>
                <h3>{x}</h3>
                <p>Temukan pilihan material untuk kebutuhan formulasi Anda.</p>
                <b>Pelajari lebih lanjut →</b>
              </Link>
            ),
          )}
        </div>
      </section>
      <section className="banner">
        <h2>
          Mari temukan material
          <br />
          untuk produk Anda.
        </h2>
        <Link className="button" href="/kontak">
          Minta Dokumen & Sampel →
        </Link>
      </section>
    </main>
  );
}
