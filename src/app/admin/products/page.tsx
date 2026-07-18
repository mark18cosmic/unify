import Link from "next/link";
import { prisma } from "@/lib/db";
import { mvr, stockStatus } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28 }}>Games</h1>
        <Link href="/admin/products/new" className="btn">+ Add Game</Link>
      </div>

      {products.length === 0 ? (
        <div className="empty">No games yet. <Link href="/admin/products/new" style={{ color: "var(--orange)" }}>Add your first one →</Link></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Game</th><th>Price</th><th>Stock</th><th>Status</th><th>Visibility</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const st = stockStatus(p.stock, p.lowStockAt);
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.title} {p.featured && <span className="badge featured">★</span>}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{p.sku} · {p.genre || "—"} · {p.condition}</div>
                    </td>
                    <td>{mvr(p.priceMvr)}</td>
                    <td><b>{p.stock}</b></td>
                    <td><span className={`badge ${st.tone} dot`}>{st.label}</span></td>
                    <td>{p.published ? <span className="muted">Published</span> : <span className="badge out">Draft</span>}</td>
                    <td style={{ textAlign: "right" }}><Link href={`/admin/products/${p.id}`} className="btn sm ghost">Edit</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
