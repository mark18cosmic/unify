import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { mvr } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { OrderStatusControls } from "@/components/OrderStatusControls";

export const dynamic = "force-dynamic";

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const isBank = order.paymentMethod === "bank_transfer";

  return (
    <>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <div>
          <Link href="/admin/orders" className="muted">← Orders</Link>
          <h1 style={{ fontSize: 28, marginTop: 6, color: "var(--orange)" }}>{order.reference}</h1>
          <div style={{ marginTop: 8 }}><StatusBadge status={order.status} /></div>
        </div>
        <div className="muted" style={{ fontSize: 13, textAlign: "right" }}>
          {new Date(order.createdAt).toLocaleString()}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        <div className="stack">
          <div className="panel">
            <h3 style={{ marginBottom: 12 }}>Items</h3>
            {order.items.map((it) => (
              <div className="summary-row" key={it.id}>
                <span>{it.title} × {it.quantity}</span>
                <span>{mvr(it.priceMvr * it.quantity)}</span>
              </div>
            ))}
            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "12px 0" }} />
            <div className="summary-row" style={{ fontSize: 18 }}>
              <b>Total</b><b style={{ color: "var(--orange)" }}>{mvr(order.subtotalMvr)}</b>
            </div>
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: 12 }}>Customer</h3>
            <div className="kv"><span className="muted">Name</span><b>{order.customerName}</b></div>
            <div className="kv"><span className="muted">Phone</span><b>{order.phone}</b></div>
            {order.email && <div className="kv"><span className="muted">Email</span><b>{order.email}</b></div>}
            <a className="btn sm" style={{ marginTop: 12 }} href={`https://wa.me/${order.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
              Message on WhatsApp
            </a>
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: 12 }}>Payment &amp; delivery</h3>
            <div className="kv"><span className="muted">Method</span><b>{isBank ? "🏦 Bank Transfer" : "🛵 Cash on Delivery"}</b></div>
            {isBank && order.transferNote && (
              <div style={{ marginTop: 10 }}>
                <div className="muted" style={{ fontSize: 13 }}>Transfer note</div>
                <div>{order.transferNote}</div>
              </div>
            )}
            {!isBank && (
              <>
                <div className="kv"><span className="muted">Island / City</span><b>{order.island || "—"}</b></div>
                {order.address && (
                  <div style={{ marginTop: 10 }}>
                    <div className="muted" style={{ fontSize: 13 }}>Address</div>
                    <div>{order.address}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <OrderStatusControls
          orderId={order.id}
          status={order.status}
          paymentMethod={order.paymentMethod}
        />
      </div>
    </>
  );
}
