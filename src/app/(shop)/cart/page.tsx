"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { mvr } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();

  return (
    <>
      <h1 style={{ fontSize: 32, marginTop: 32 }}>Your Cart</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="btn" style={{ marginTop: 12 }}>Browse Games</Link>
        </div>
      ) : (
        <div className="checkout">
          <div className="panel">
            {items.map((i) => (
              <div className="line" key={i.id}>
                {i.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="thumb" src={i.coverImage} alt={i.title} />
                ) : (
                  <div className="thumb" style={{ display: "grid", placeItems: "center" }}>🎮</div>
                )}
                <div className="grow">
                  <Link href={`/shop/${i.slug}`} style={{ fontWeight: 700 }}>{i.title}</Link>
                  <div className="muted" style={{ fontSize: 14 }}>{mvr(i.priceMvr)}</div>
                  <button
                    className="muted"
                    onClick={() => remove(i.id)}
                    style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: 0, marginTop: 6, fontSize: 13 }}
                  >
                    Remove
                  </button>
                </div>
                <div className="stack" style={{ alignItems: "end", gap: 10 }}>
                  <div className="qty">
                    <button onClick={() => setQty(i.id, i.quantity - 1)}>−</button>
                    <span>{i.quantity}</span>
                    <button onClick={() => setQty(i.id, i.quantity + 1)}>+</button>
                  </div>
                  <b>{mvr(i.priceMvr * i.quantity)}</b>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: 14 }}>Order Summary</h3>
            <div className="summary-row"><span className="muted">Subtotal</span><b>{mvr(subtotal)}</b></div>
            <div className="summary-row"><span className="muted">Delivery</span><span className="muted">Arranged after order</span></div>
            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "12px 0" }} />
            <div className="summary-row" style={{ fontSize: 18 }}><b>Total</b><b style={{ color: "var(--orange)" }}>{mvr(subtotal)}</b></div>
            <Link href="/checkout" className="btn block" style={{ marginTop: 16 }}>Proceed to Checkout</Link>
            <p className="muted" style={{ fontSize: 13, textAlign: "center", marginTop: 10 }}>
              Pay by bank transfer or cash on delivery
            </p>
          </div>
        </div>
      )}
    </>
  );
}
