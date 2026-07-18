"use client";

import { useState, useTransition } from "react";
import { adjustStock } from "@/lib/adminActions";

export function StockAdjust({ productId, stock }: { productId: string; stock: number }) {
  const [delta, setDelta] = useState(1);
  const [reason, setReason] = useState("restock");
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();

  function apply(sign: number) {
    const change = sign * Math.abs(delta);
    if (!change) return;
    start(async () => {
      await adjustStock(productId, change, reason, note);
      setNote("");
    });
  }

  return (
    <div className="panel">
      <h3 style={{ marginBottom: 4 }}>Stock</h3>
      <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 14 }}>{stock}</div>
      <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
        <input type="number" min="1" value={delta} onChange={(e) => setDelta(parseInt(e.target.value) || 1)} style={{ width: 90 }} />
        <select value={reason} onChange={(e) => setReason(e.target.value)} style={{ width: 150 }}>
          <option value="restock">Restock</option>
          <option value="correction">Correction</option>
          <option value="sale">Sale / manual</option>
        </select>
        <input placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} style={{ flex: 1, minWidth: 140 }} />
      </div>
      <div className="row" style={{ gap: 10, marginTop: 12 }}>
        <button className="btn" disabled={pending} onClick={() => apply(1)}>+ Add {Math.abs(delta)}</button>
        <button className="btn ghost" disabled={pending || stock <= 0} onClick={() => apply(-1)}>− Remove {Math.abs(delta)}</button>
      </div>
    </div>
  );
}
