import "./style.css";
import Link from "next/link";
export const metadata = {
  title: "PT Sericite Mica Indonesia",
  description:
    "Sericite mica dan pearlescent pigments untuk formulasi industri.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header>
          <Link className="brand" href="/">
            PT SERICITE MICA
            <br />
            INDONESIA
          </Link>
          <nav>
            <Link href="/">Beranda</Link>
            <Link href="/profil">Profil</Link>
            <Link href="/katalog">Katalog Produk</Link>
            <Link href="/surface">Surface Treatment</Link>
            <Link href="/dokumen">Permintaan Dokumen</Link>
            <Link href="/kontak">Kontak</Link>
          </nav>
          <Link className="button" href="/dokumen">
            Minta Sampel
          </Link>
        </header>
        {children}
        <footer>
          <strong>PT SERICITE MICA INDONESIA</strong>
          <p>Sericite Mica & Pearlescent Pigments</p>
          <Link href="/privasi">Kebijakan Privasi</Link>
          <p>© {new Date().getFullYear()} PT Sericite Mica Indonesia</p>
        </footer>
      </body>
    </html>
  );
}
