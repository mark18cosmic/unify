"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/adminActions";

export function DeleteProduct({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      className="btn danger sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this game permanently?")) return;
        start(async () => {
          await deleteProduct(id);
          router.push("/admin/products");
        });
      }}
    >
      {pending ? "Deleting…" : "Delete game"}
    </button>
  );
}
