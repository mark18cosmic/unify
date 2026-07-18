import Link from "next/link";
import { prisma } from "@/lib/db";
import { mvr } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, orders, lowStock, pendingPay, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.findMany({ where: { stock: { lte: 3 } }, orderBy: { stock: "asc" } }),
    prisma.order.count({ where: { status: "Pending Payment Confirmation" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const revenue = await prisma.order.aggregate({
    _sum: { subtotalMvr: true },
    where: { status: { in: ["Confirmed", "Shipped", "Completed"] } },
  });

  const outOfStock = lowStock.filter((p) => p.stock <= 0);

  return (
    <>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Dashboard</h1>

      <div className="stat-grid">
        <div className="stat"><div className="n">{products}</div><div className="l">Games listed</div></div>
        <div className="stat"><div className="n">{orders}</div><div className="l">Total orders</div></div>
        <div className="stat"><div className="n" style={{ color: "var(--yellow)" }}>{pendingPay}</div><div className="l">Awaiting payment</div></div>
        <div className="stat"><div className="n" style={{ color: "var(--orange)" }}>{mvr(revenue._sum.subtotalMvr || 0)}</div><div className="l">Confirmed revenue</div></div>
      </div>

      {(lowStock.length > 0) && (
        <div className="section" style={{ marginTop: 32 }}>
          <div className="flash" style={{ background: "rgba(255,176,32,.1)", color: "var(--yellow)", border: "1px solid rgba(255,176,32,.3)" }}>
            ⚠️ {outOfStock.length} out of stock · {lowStock.length - outOfStock.length} low on stock
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Game</th><th>Stock</th><th>Threshold</th><th></th></tr></thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td><b style={{ color: p.stock <= 0 ? "var(--red)" : "var(--yellow)" }}>{p.stock}</b></td>
                    <td className="muted">{p.lowStockAt}</td>
                    <td style={{ textAlign: "right" }}><Link href={`/admin/products/${p.id}`} className="btn sm ghost">Restock</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="section" style={{ marginTop: 32 }}>
        <div className="section-head"><h2 style={{ fontSize: 20 }}>Recent orders</h2><Link href="/admin/orders">All orders →</Link></div>
        {recentOrders.length === 0 ? (
          <div className="empty">No orders yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Reference</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td><Link href={`/admin/orders/${o.id}`} style={{ color: "var(--orange)", fontWeight: 700 }}>{o.reference}</Link></td>
                    <td>{o.customerName}</td>
                    <td>{mvr(o.subtotalMvr)}</td>
                    <td><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
