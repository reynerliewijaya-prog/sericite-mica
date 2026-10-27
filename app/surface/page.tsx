import Link from "next/link";
export default function Surface() {
  return (
    <main>
      <section>
        <span className="eyebrow">SURFACE TREATMENT</span>
        <h1>
          Dirancang untuk
          <br />
          formulasi Anda.
        </h1>
        <p>
          Diskusikan kebutuhan dispersi, kompatibilitas, dan karakteristik
          permukaan dengan tim kami. Kesesuaian material perlu dikonfirmasi
          melalui spesifikasi teknis dan pengujian aplikasi.
        </p>
        <Link className="button" href="/kontak">
          Konsultasikan Kebutuhan
        </Link>
      </section>
    </main>
  );
}
