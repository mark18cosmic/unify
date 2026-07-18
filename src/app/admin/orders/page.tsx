import Link from "next/link";
import { prisma } from "@/lib/db";
import { mvr, ORDER_STATUSES } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Orders</h1>

      <div className="row" style={{ flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        <Link href="/admin/orders" className={`btn sm ${!status ? "" : "ghost"}`}>All</Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${encodeURIComponent(s)}`} className={`btn sm ${status === s ? "" : "ghost"}`}>{s}</Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="empty">No orders here.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Reference</th><th>Customer</th><th>Payment</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><Link href={`/admin/orders/${o.id}`} style={{ color: "var(--orange)", fontWeight: 700 }}>{o.reference}</Link></td>
                  <td>{o.customerName}<div className="muted" style={{ fontSize: 12 }}>{o.phone}</div></td>
                  <td>{o.paymentMethod === "bank_transfer" ? "🏦 Bank" : "🛵 COD"}</td>
                  <td>{mvr(o.subtotalMvr)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="muted" style={{ fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
