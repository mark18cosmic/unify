"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/format";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user.email || "admin";
}

function num(v: FormDataEntryValue | null, fallback = 0) {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export async function saveProduct(id: string | null, form: FormData) {
  await requireAdmin();
  const title = String(form.get("title") || "").trim();
  if (!title) return { error: "Title is required." };

  const data = {
    title,
    slug: slugify(String(form.get("slug") || title)) || slugify(title),
    sku: String(form.get("sku") || "").trim() || `SKU-${Date.now()}`,
    description: String(form.get("description") || ""),
    priceMvr: num(form.get("priceMvr")),
    genre: String(form.get("genre") || "").trim(),
    condition: String(form.get("condition") || "New"),
    coverImage: String(form.get("coverImage") || "").trim(),
    lowStockAt: num(form.get("lowStockAt"), 3),
    published: form.get("published") === "on",
    featured: form.get("featured") === "on",
  };

  try {
    if (id) {
      await prisma.product.update({ where: { id }, data });
    } else {
      const stock = num(form.get("stock"));
      const created = await prisma.product.create({ data: { ...data, stock } });
      if (stock > 0) {
        await prisma.stockLog.create({
          data: { productId: created.id, change: stock, reason: "restock", note: "Initial stock", actor: "admin" },
        });
      }
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique")) return { error: "Slug or SKU already exists." };
    return { error: "Could not save product." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export async function adjustStock(productId: string, change: number, reason: string, note: string) {
  const actor = await requireAdmin();
  if (!change) return;
  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: change } },
    }),
    prisma.stockLog.create({
      data: { productId, change, reason, note, actor },
    }),
  ]);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/admin");
}

// Deduct stock for all items in an order (called when confirming payment/order)
async function deductOrderStock(orderId: string, actor: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  for (const it of items) {
    await prisma.$transaction([
      prisma.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      }),
      prisma.stockLog.create({
        data: {
          productId: it.productId,
          change: -it.quantity,
          reason: "sale",
          note: `Order sale`,
          actor,
        },
      }),
    ]);
  }
}

export async function setOrderStatus(orderId: string, status: string) {
  const actor = await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  // Auto-decrement stock the first time an order moves to Confirmed
  const nowConfirmed = status === "Confirmed" && order.status !== "Confirmed";
  const wasConfirmedBefore = ["Confirmed", "Shipped", "Completed"].includes(order.status);

  if (nowConfirmed && !wasConfirmedBefore) {
    await deductOrderStock(orderId, actor);
  }

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
}
