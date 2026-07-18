import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";
import { saveProduct } from "@/lib/adminActions";

export const metadata = { title: "Add Game" };

export default function NewProductPage() {
  async function action(formData: FormData) {
    "use server";
    await saveProduct(null, formData);
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/products" className="muted">← Games</Link>
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Add Game</h1>
      <ProductForm action={action} />
    </>
  );
}
