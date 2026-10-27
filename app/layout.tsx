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
        <header className="site-header">
          <Link className="brand" href="/">
            <img
              src="/assets/logo-sericite.png"
              width="52"
              height="52"
              alt="Logo PT Sericite Mica Indonesia"
            />
            <span>
              PT SERICITE MICA
              <br />
              INDONESIA
            </span>
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
        <footer className="site-footer">
          <strong>PT SERICITE MICA INDONESIA</strong>
          <p>Sericite Mica & Pearlescent Pigments</p>
          <a href="mailto:serciteindo@gmail.com">serciteindo@gmail.com</a>
          <br />
          <Link href="/privasi">Kebijakan Privasi</Link>
          <p>© {new Date().getFullYear()} PT Sericite Mica Indonesia</p>
        </footer>
      </body>
    </html>
  );
}
