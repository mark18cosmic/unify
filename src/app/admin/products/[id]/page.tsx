import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/ProductForm";
import { StockAdjust } from "@/components/StockAdjust";
import { DeleteProduct } from "@/components/DeleteProduct";
import { saveProduct } from "@/lib/adminActions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const logs = await prisma.stockLog.findMany({
    where: { productId: id },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  async function action(formData: FormData) {
    "use server";
    await saveProduct(id, formData);
  }

  return (
    <>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <div>
          <Link href="/admin/products" className="muted">← Games</Link>
          <h1 style={{ fontSize: 28, marginTop: 6 }}>{product.title}</h1>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <Link href={`/shop/${product.slug}`} target="_blank" className="btn ghost sm">View in store ↗</Link>
          <DeleteProduct id={product.id} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        <ProductForm action={action} product={product} />

        <div className="stack">
          <StockAdjust productId={product.id} stock={product.stock} />

          <div className="panel">
            <h3 style={{ marginBottom: 10 }}>Stock history</h3>
            {logs.length === 0 ? (
              <p className="muted" style={{ fontSize: 14 }}>No changes yet.</p>
            ) : (
              <div className="stack" style={{ gap: 8 }}>
                {logs.map((l) => (
                  <div key={l.id} className="row between" style={{ fontSize: 13, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <b style={{ color: l.change >= 0 ? "var(--green)" : "var(--red)" }}>
                        {l.change >= 0 ? "+" : ""}{l.change}
                      </b>{" "}
                      <span className="muted">{l.reason}{l.note ? ` · ${l.note}` : ""}</span>
                    </div>
                    <span className="muted">{new Date(l.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
