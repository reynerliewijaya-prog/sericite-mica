import Link from "next/link";
import Inquiry from "../kontak/form";
export const metadata = {
  title: "Permintaan Dokumen dan Sampel | Sericite Mica",
};
export default function Documents() {
  return (
    <main className="contact-page">
      <div className="contact-intro">
        <div className="contact-container">
          <div className="breadcrumbs">
            <Link href="/">Beranda</Link> / Permintaan Dokumen
          </div>
          <h1>Permintaan Dokumen &amp; Sampel</h1>
          <p>
            Ajukan COA, MSDS, TDS, spesifikasi produk, atau sampel. Isi form di
            bawah dan tim sales kami akan menindaklanjuti.
          </p>
        </div>
      </div>
      <div className="contact-container document-columns">
        <div className="contact-form-panel">
          <Inquiry documents />
        </div>
        <aside className="document-aside">
          <div className="document-process">
            <span>PROSES</span>
            {[
              "Anda mengisi form dan memilih jenis dokumen.",
              "Setelah permintaan tersimpan, sistem mencoba mengirim notifikasi email ke tim Sales Internal.",
              "Permintaan tercatat di dashboard untuk ditindaklanjuti tim bisnis.",
            ].map((text, i) => (
              <div key={text}>
                <b>{i + 1}</b>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="document-direct">
            <h2>Hubungi langsung</h2>
            <a href="mailto:serciteindo@gmail.com">serciteindo@gmail.com</a>
            <p>www.sericite-mica.com</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
