"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "./CartProvider";

export function AddToCart({
  item,
  maxStock,
}: {
  item: Omit<CartItem, "quantity">;
  maxStock: number;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  if (maxStock <= 0) {
    return <button className="btn block" disabled>Out of Stock</button>;
  }

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 14 }}>
        <div className="qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => Math.min(maxStock, q + 1))}>+</button>
        </div>
        <span className="muted" style={{ fontSize: 13 }}>{maxStock} available</span>
      </div>
      <div className="row" style={{ gap: 12 }}>
        <button
          className="btn grow"
          onClick={() => {
            add(item, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
        >
          {added ? "✓ Added" : "Add to Cart"}
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            add(item, qty);
            router.push("/cart");
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
