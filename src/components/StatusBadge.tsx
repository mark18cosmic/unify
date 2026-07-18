const MAP: Record<string, string> = {
  "Pending Payment Confirmation": "st-pay",
  "Pending Delivery": "st-del",
  Confirmed: "st-conf",
  Shipped: "st-ship",
  Completed: "st-done",
  Cancelled: "st-cancel",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge ${MAP[status] || "st-del"}`}>{status}</span>;
}
