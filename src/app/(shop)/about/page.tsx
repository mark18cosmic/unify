import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "About the Club" };

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 760, margin: "40px auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-block" }}><Logo size={72} /></div>
        <h1 style={{ fontSize: 36, marginTop: 16 }}>Unify Games Club</h1>
        <p className="muted" style={{ fontSize: 18 }}>Join the Club.</p>
      </div>

      <div className="panel stack">
        <p>
          UnifyGames started as a community of Maldivian gamers — bringing players
          together through FIFA nights, PS5 tournaments, and meetups. Today we&apos;re
          bringing that same energy to a store, making it easy to grab the latest
          PlayStation 5 titles right here in the Maldives.
        </p>
        <p>
          Every order supports the club and the events we run. We keep things simple:
          browse the games, place an order, and pay by <b>bank transfer</b> or
          <b> cash on delivery</b> — no cards, no hassle. Our team confirms every order
          personally over WhatsApp.
        </p>
        <div className="info">
          <h4>What we&apos;re about</h4>
          <div className="stack" style={{ gap: 6, fontSize: 15 }}>
            <span>🏆 Tournaments &amp; competitive play</span>
            <span>🎪 Community events &amp; meetups</span>
            <span>🎮 Genuine PS5 games, delivered island-wide</span>
          </div>
        </div>
        <div className="row" style={{ gap: 12, justifyContent: "center", marginTop: 8 }}>
          <a className="btn" href="https://instagram.com/unifygames.mv" target="_blank" rel="noreferrer">Instagram</a>
          <a className="btn ghost" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a className="btn ghost" href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
          <Link className="btn ghost" href="/shop">Shop Games</Link>
        </div>
      </div>
    </div>
  );
}
