import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const newest = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <section className="hero">
        <span className="pill">🏆 UNIFY GAMES CLUB</span>
        <h1>The Maldives&apos; home for PS5 games.</h1>
        <p>
          Grab the latest PlayStation 5 titles, join our tournaments, and be part
          of the club. Bank transfer or cash on delivery — island-wide.
        </p>
        <div className="row" style={{ gap: 12 }}>
          <Link href="/shop" className="btn">Shop PS5 Games</Link>
          <Link href="/about" className="btn ghost">Join the Club</Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Featured Titles</h2>
            <Link href="/shop">View all →</Link>
          </div>
          <div className="grid">
            {featured.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2>New Arrivals</h2>
          <Link href="/shop">Browse shop →</Link>
        </div>
        {newest.length === 0 ? (
          <div className="empty">No games listed yet. Check back soon!</div>
        ) : (
          <div className="grid">
            {newest.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div
          className="hero"
          style={{ marginTop: 0, padding: "40px 44px", textAlign: "center" }}
        >
          <span className="pill">🎪 EVENTS &amp; TOURNAMENTS</span>
          <h2 style={{ fontSize: 30, margin: "16px 0 10px" }}>
            More than a store — a community.
          </h2>
          <p className="muted" style={{ margin: "0 auto 20px", maxWidth: 520 }}>
            Follow Unify Games Club for FIFA nights, PS5 tournaments, and meetups
            across the Maldives.
          </p>
          <a
            href="https://instagram.com/unifygames.mv"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            Follow on Instagram
          </a>
        </div>
      </section>
    </>
  );
}
