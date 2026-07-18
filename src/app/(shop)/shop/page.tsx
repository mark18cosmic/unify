import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shop PS5 Games" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const { q, genre } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(genre ? { genre } : {}),
      ...(q
        ? { title: { contains: q } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const all = await prisma.product.findMany({
    where: { published: true },
    select: { genre: true },
  });
  const genres = Array.from(
    new Set(all.map((p) => p.genre).filter(Boolean))
  ).sort();

  return (
    <>
      <div className="section-head" style={{ marginTop: 32 }}>
        <h1 style={{ fontSize: 32 }}>PS5 Games</h1>
        <form action="/shop" style={{ display: "flex", gap: 8, width: 320, maxWidth: "50%" }}>
          <input name="q" placeholder="Search titles…" defaultValue={q || ""} />
          <button className="btn sm" type="submit">Search</button>
        </form>
      </div>

      <div className="row" style={{ flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        <Link href="/shop" className={`btn sm ${!genre ? "" : "ghost"}`}>All</Link>
        {genres.map((g) => (
          <Link
            key={g}
            href={`/shop?genre=${encodeURIComponent(g)}`}
            className={`btn sm ${genre === g ? "" : "ghost"}`}
          >
            {g}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="empty">No games match your search.</div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </>
  );
}
