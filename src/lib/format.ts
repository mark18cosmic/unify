export function mvr(amount: number): string {
  return "MVR " + new Intl.NumberFormat("en-US").format(amount);
}

export function stockStatus(stock: number, lowStockAt: number) {
  if (stock <= 0) return { label: "Out of Stock", tone: "out" as const };
  if (stock <= lowStockAt) return { label: "Low Stock", tone: "low" as const };
  return { label: "In Stock", tone: "in" as const };
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const ORDER_STATUSES = [
  "Pending Payment Confirmation",
  "Pending Delivery",
  "Confirmed",
  "Shipped",
  "Completed",
  "Cancelled",
] as const;
