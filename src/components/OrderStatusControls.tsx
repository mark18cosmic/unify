"use client";

import { useTransition } from "react";
import { setOrderStatus } from "@/lib/adminActions";
import { ORDER_STATUSES } from "@/lib/format";

export function OrderStatusControls({
  orderId,
  status,
  paymentMethod,
}: {
  orderId: string;
  status: string;
  paymentMethod: string;
}) {
  const [pending, start] = useTransition();

  function go(s: string) {
    start(() => setOrderStatus(orderId, s));
  }

  return (
    <div className="panel">
      <h3 style={{ marginBottom: 12 }}>Update status</h3>

      <div className="stack" style={{ gap: 10 }}>
        {paymentMethod === "bank_transfer" && status === "Pending Payment Confirmation" && (
          <button className="btn block" disabled={pending} onClick={() => go("Confirmed")}>
            ✓ Mark as Paid &amp; Confirm
          </button>
        )}
        {paymentMethod === "cod" && status === "Pending Delivery" && (
          <button className="btn block" disabled={pending} onClick={() => go("Confirmed")}>
            ✓ Confirm order
          </button>
        )}

        <div className="field">
          <label>Set status manually</label>
          <select
            value={status}
            disabled={pending}
            onChange={(e) => go(e.target.value)}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <p className="muted" style={{ fontSize: 13, margin: 0 }}>
          Stock is auto-deducted the first time an order becomes <b>Confirmed</b>.
        </p>
      </div>
    </div>
  );
}
