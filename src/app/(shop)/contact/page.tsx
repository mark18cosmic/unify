export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 640, margin: "40px auto" }}>
      <h1 style={{ fontSize: 34 }}>Get in touch</h1>
      <p className="muted">We reply fastest on WhatsApp and Instagram DMs.</p>

      <div className="stack" style={{ marginTop: 24 }}>
        <a className="panel row between" href="https://wa.me/9600000000" target="_blank" rel="noreferrer">
          <div><b>💬 WhatsApp</b><div className="muted" style={{ fontSize: 14 }}>Orders &amp; payment confirmation</div></div>
          <span className="btn sm">Chat →</span>
        </a>
        <a className="panel row between" href="tel:+9600000000">
          <div><b>📞 Phone</b><div className="muted" style={{ fontSize: 14 }}>+960 000-0000</div></div>
          <span className="btn sm ghost">Call →</span>
        </a>
        <a className="panel row between" href="https://instagram.com/unifygames.mv" target="_blank" rel="noreferrer">
          <div><b>📸 Instagram</b><div className="muted" style={{ fontSize: 14 }}>@unifygames.mv</div></div>
          <span className="btn sm ghost">Follow →</span>
        </a>
        <div className="panel">
          <b>📍 Delivery</b>
          <div className="muted" style={{ fontSize: 14 }}>Malé, Hulhumalé &amp; island-wide delivery across the Maldives.</div>
        </div>
      </div>
    </div>
  );
}
