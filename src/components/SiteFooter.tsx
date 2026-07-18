import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div style={{ maxWidth: 320 }}>
          <div className="brand" style={{ marginBottom: 12 }}>
            <Logo size={34} />
            <span>UnifyGames</span>
          </div>
          <p className="muted" style={{ fontSize: 14 }}>
            Maldives&apos; home of PS5 gaming and the Unify Games Club community —
            tournaments, events, and the titles you love.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: 12 }}>Shop</h4>
          <div className="stack" style={{ gap: 8, fontSize: 14 }}>
            <Link href="/shop" className="muted">All PS5 Games</Link>
            <Link href="/cart" className="muted">Cart</Link>
            <Link href="/about" className="muted">About the Club</Link>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: 12 }}>Connect</h4>
          <div className="socials" style={{ flexDirection: "column", gap: 8, fontSize: 14 }}>
            <a href="https://instagram.com/unifygames.mv" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
            <a href="https://wa.me/9600000000" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="container" style={{ paddingTop: 0, paddingBottom: 30 }}>
        <span className="muted" style={{ fontSize: 13 }}>
          © {new Date().getFullYear()} Unify Games Pvt Ltd · unifygames.mv · Payments: Bank Transfer &amp; Cash on Delivery
        </span>
      </div>
    </footer>
  );
}
