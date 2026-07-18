"use server";

import { prisma } from "@/lib/db";

function makeRef() {
  const n = Math.floor(1000 + Math.random() * 9000);
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `UG-${ymd}-${n}`;
}

export type CheckoutInput = {
  customerName: string;
  phone: string;
  email?: string;
  paymentMethod: "bank_transfer" | "cod";
  island?: string;
  address?: string;
  transferNote?: string;
  items: { id: string; quantity: number }[];
};

export async function createOrder(input: CheckoutInput) {
  const { customerName, phone, paymentMethod, items } = input;

  if (!customerName?.trim()) return { error: "Please enter your name." };
  if (!phone?.trim()) return { error: "Please enter a phone number." };
  if (!items?.length) return { error: "Your cart is empty." };
  if (paymentMethod !== "bank_transfer" && paymentMethod !== "cod")
    return { error: "Choose a payment method." };
  if (paymentMethod === "cod" && !input.island?.trim())
    return { error: "Please enter your delivery island/address." };

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.id) } },
  });

  const orderItems = [];
  let subtotal = 0;
  for (const it of items) {
    const p = products.find((x) => x.id === it.id);
    if (!p || !p.published) return { error: "A game in your cart is no longer available." };
    if (it.quantity < 1) continue;
    if (it.quantity > p.stock)
      return { error: `Only ${p.stock} left of "${p.title}". Please adjust your cart.` };
    subtotal += p.priceMvr * it.quantity;
    orderItems.push({
      productId: p.id,
      title: p.title,
      priceMvr: p.priceMvr,
      quantity: it.quantity,
    });
  }
  if (orderItems.length === 0) return { error: "Your cart is empty." };

  let reference = makeRef();
  // ensure uniqueness
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.order.findUnique({ where: { reference } });
    if (!exists) break;
    reference = makeRef();
  }

  const status =
    paymentMethod === "bank_transfer"
      ? "Pending Payment Confirmation"
      : "Pending Delivery";

  const order = await prisma.order.create({
    data: {
      reference,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: input.email?.trim() || "",
      paymentMethod,
      status,
      island: input.island?.trim() || "",
      address: input.address?.trim() || "",
      transferNote: input.transferNote?.trim() || "",
      subtotalMvr: subtotal,
      items: { create: orderItems },
    },
  });

  return { reference: order.reference };
}
