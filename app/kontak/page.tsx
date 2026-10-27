import Link from "next/link";
import Inquiry from "./form";
function Icon({ type }: { type: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === "mail" ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </>
      ) : type === "globe" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
        </>
      ) : type === "pin" ? (
        <>
          <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </>
      ) : (
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
      )}
    </svg>
  );
}
export default function Contact() {
  return (
    <main className="contact-page">
      <div className="contact-intro">
        <div className="contact-container">
          <div className="breadcrumbs">
            <Link href="/">Beranda</Link> / Kontak
          </div>
          <h1>Hubungi Kami</h1>
          <p>
            Untuk pertanyaan umum, kerja sama, atau kebutuhan bahan baku khusus.
            Untuk COA, MSDS, TDS, dan sampel, sebutkan kebutuhan Anda pada
            pesan.
          </p>
        </div>
      </div>
      <div className="contact-container contact-columns">
        <aside className="contact-info" aria-label="Informasi kontak">
          <div className="contact-info-card">
            <Icon type="mail" />
            <div>
              <small>Email resmi</small>
              <a href="mailto:serciteindo@gmail.com">serciteindo@gmail.com</a>
            </div>
          </div>
          <div className="contact-info-card">
            <Icon type="globe" />
            <div>
              <small>Situs web</small>
              <strong>www.sericite-mica.com</strong>
            </div>
          </div>
          <div className="contact-info-card placeholder">
            <Icon type="pin" />
            <div>
              <small>Alamat kantor &amp; pabrik</small>
              <span>Alamat akan ditambahkan</span>
            </div>
          </div>
          <div className="contact-info-card placeholder">
            <Icon type="phone" />
            <div>
              <small>Telepon / WhatsApp</small>
              <span>Nomor telepon akan ditambahkan</span>
            </div>
          </div>
          <div className="contact-map">Peta lokasi akan ditambahkan</div>
        </aside>
        <div className="contact-form-panel">
          <Inquiry />
        </div>
      </div>
    </main>
  );
}
