"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { mvr } from "@/lib/format";
import { createOrder } from "@/lib/orderActions";

type Bank = { name: string; accName: string; accNo: string };

export function CheckoutForm({ bank }: { bank: Bank }) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<"bank_transfer" | "cod">("bank_transfer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    island: "",
    address: "",
    transferNote: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="empty">
        <p>Your cart is empty.</p>
        <Link href="/shop" className="btn" style={{ marginTop: 12 }}>Browse Games</Link>
      </div>
    );
  }

  async function submit() {
    setError("");
    setBusy(true);
    const res = await createOrder({
      ...form,
      paymentMethod: method,
      items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
    });
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    clear();
    router.push(`/order/${res.reference}`);
  }

  return (
    <div className="checkout">
      <div className="stack">
        {error && <div className="flash err">{error}</div>}

        <div className="panel">
          <h3 style={{ marginBottom: 16 }}>Your Details</h3>
          <div className="field">
            <label>Full name *</label>
            <input value={form.customerName} onChange={set("customerName")} placeholder="Ahmed Ali" />
          </div>
          <div className="row" style={{ gap: 14 }}>
            <div className="field grow">
              <label>Phone / WhatsApp *</label>
              <input value={form.phone} onChange={set("phone")} placeholder="7XX XXXX" />
            </div>
            <div className="field grow">
              <label>Email (optional)</label>
              <input value={form.email} onChange={set("email")} placeholder="you@email.com" />
            </div>
          </div>
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: 16 }}>Payment Method</h3>
          <div className="stack" style={{ gap: 12 }}>
            <label className={`radio-card ${method === "bank_transfer" ? "active" : ""}`}>
              <input type="radio" name="pm" checked={method === "bank_transfer"} onChange={() => setMethod("bank_transfer")} />
              <div>
                <b>🏦 Bank Transfer</b>
                <div className="muted" style={{ fontSize: 14 }}>Transfer to our account and send the receipt. We confirm your order once received.</div>
              </div>
            </label>
            <label className={`radio-card ${method === "cod" ? "active" : ""}`}>
              <input type="radio" name="pm" checked={method === "cod"} onChange={() => setMethod("cod")} />
              <div>
                <b>🛵 Cash on Delivery</b>
                <div className="muted" style={{ fontSize: 14 }}>Pay in cash when we deliver. Available across the Maldives.</div>
              </div>
            </label>
          </div>

          {method === "bank_transfer" && (
            <div className="info" style={{ marginTop: 16 }}>
              <h4>Transfer to</h4>
              <div className="kv"><span className="muted">Bank</span><b>{bank.name}</b></div>
              <div className="kv"><span className="muted">Account name</span><b>{bank.accName}</b></div>
              <div className="kv"><span className="muted">Account no.</span><b>{bank.accNo}</b></div>
              <p className="muted" style={{ fontSize: 13, marginTop: 8, marginBottom: 0 }}>
                Use your name as the reference. You&apos;ll get an order number on the next screen to share with us on WhatsApp.
              </p>
              <div className="field" style={{ marginTop: 12 }}>
                <label>Transfer note (optional)</label>
                <textarea value={form.transferNote} onChange={set("transferNote")} placeholder="e.g. Transferred MVR 1,200 from BML at 3:40pm" />
              </div>
            </div>
          )}

          {method === "cod" && (
            <div style={{ marginTop: 16 }}>
              <div className="field">
                <label>Island / City *</label>
                <input value={form.island} onChange={set("island")} placeholder="Malé / Hulhumalé / …" />
              </div>
              <div className="field">
                <label>Delivery address / notes</label>
                <textarea value={form.address} onChange={set("address")} placeholder="House name, floor, landmark…" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginBottom: 14 }}>Order Summary</h3>
        {items.map((i) => (
          <div className="summary-row" key={i.id}>
            <span className="muted" style={{ fontSize: 14 }}>{i.title} × {i.quantity}</span>
            <span>{mvr(i.priceMvr * i.quantity)}</span>
          </div>
        ))}
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "12px 0" }} />
        <div className="summary-row" style={{ fontSize: 18 }}>
          <b>Total</b><b style={{ color: "var(--orange)" }}>{mvr(subtotal)}</b>
        </div>
        <button className="btn block" style={{ marginTop: 16 }} disabled={busy} onClick={submit}>
          {busy ? "Placing order…" : "Place Order"}
        </button>
        <p className="muted" style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}>
          No card required · order confirmed manually by our team
        </p>
      </div>
    </div>
  );
}
