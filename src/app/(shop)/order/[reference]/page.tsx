import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { bankConfig } from "@/lib/bank";
import { mvr } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order Confirmed" };

export default async function OrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
  if (!order) notFound();

  const bank = bankConfig();
  const isBank = order.paymentMethod === "bank_transfer";

  return (
    <div style={{ maxWidth: 640, margin: "40px auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 52 }}>✅</div>
        <h1 style={{ fontSize: 30, marginTop: 8 }}>Order placed!</h1>
        <p className="muted">Thank you, {order.customerName}. Save your reference below.</p>
      </div>

      <div className="panel">
        <div className="row between" style={{ marginBottom: 12 }}>
          <div>
            <div className="muted" style={{ fontSize: 13 }}>Order reference</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--orange)" }}>{order.reference}</div>
          </div>
          <StatusBadge status={order.status} />
        </div>

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

      <div className="info" style={{ marginTop: 20 }}>
        <h4>Next steps</h4>
        {isBank ? (
          <>
            <p style={{ marginTop: 0, fontSize: 14 }}>
              Please transfer <b>{mvr(order.subtotalMvr)}</b> to:
            </p>
            <div className="kv"><span className="muted">Bank</span><b>{bank.name}</b></div>
            <div className="kv"><span className="muted">Account name</span><b>{bank.accName}</b></div>
            <div className="kv"><span className="muted">Account no.</span><b>{bank.accNo}</b></div>
            <div className="kv"><span className="muted">Reference</span><b>{order.reference}</b></div>
            <p className="muted" style={{ fontSize: 14, marginBottom: 0 }}>
              Send your transfer receipt with reference <b>{order.reference}</b> to us on WhatsApp.
              Your order stays in <b>Pending Payment Confirmation</b> until we verify it.
            </p>
          </>
        ) : (
          <>
            <p style={{ marginTop: 0, fontSize: 14 }}>
              We&apos;ll deliver to <b>{order.island}</b> and collect <b>{mvr(order.subtotalMvr)}</b> in cash.
            </p>
            <p className="muted" style={{ fontSize: 14, marginBottom: 0 }}>
              Our team will contact you on <b>{order.phone}</b> to arrange delivery.
            </p>
          </>
        )}
      </div>

      <div className="row" style={{ gap: 12, marginTop: 22, justifyContent: "center" }}>
        <a className="btn" href={`https://wa.me/9600000000?text=${encodeURIComponent(`Hi UnifyGames! My order ${order.reference} — `)}`} target="_blank" rel="noreferrer">
          Message us on WhatsApp
        </a>
        <Link href="/shop" className="btn ghost">Continue Shopping</Link>
      </div>
    </div>
  );
}
