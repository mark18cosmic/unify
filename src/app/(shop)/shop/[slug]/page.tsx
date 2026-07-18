import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { mvr, stockStatus } from "@/lib/format";
import { AddToCart } from "@/components/AddToCart";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  return { title: p?.title ?? "Game" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p || !p.published) notFound();

  const st = stockStatus(p.stock, p.lowStockAt);

  return (
    <>
      <div style={{ marginTop: 24 }}>
        <Link href="/shop" className="muted">← Back to shop</Link>
      </div>
      <div className="detail">
        <div className="cover">
          {p.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.coverImage} alt={p.title} />
          ) : (
            <div className="ph" style={{ display: "grid", placeItems: "center", height: "100%", fontSize: 64 }}>🎮</div>
          )}
        </div>
        <div className="stack">
          <div className="row" style={{ gap: 10 }}>
            <span className={`badge ${st.tone} dot`}>{st.label}</span>
            <span className="badge featured">{p.condition}</span>
          </div>
          <h1>{p.title}</h1>
          <div className="price-big">{mvr(p.priceMvr)}</div>
          <p className="muted" style={{ fontSize: 16 }}>{p.description || "No description provided."}</p>

          <div style={{ maxWidth: 420 }}>
            <div className="spec"><b>Platform</b> PlayStation 5</div>
            <div className="spec"><b>Genre</b> {p.genre || "—"}</div>
            <div className="spec"><b>Condition</b> {p.condition}</div>
            <div className="spec"><b>SKU</b> {p.sku}</div>
          </div>

          <div style={{ maxWidth: 420, marginTop: 8 }}>
            <AddToCart
              maxStock={p.stock}
              item={{
                id: p.id,
                slug: p.slug,
                title: p.title,
                priceMvr: p.priceMvr,
                coverImage: p.coverImage,
              }}
            />
          </div>

          <div className="info" style={{ maxWidth: 420 }}>
            <h4>How to pay</h4>
            <p className="muted" style={{ fontSize: 14, margin: 0 }}>
              No card needed — pay by <b>bank transfer</b> or <b>cash on delivery</b>.
              We&apos;ll confirm your order over WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
