import { CheckoutForm } from "@/components/CheckoutForm";
import { bankConfig } from "@/lib/bank";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <h1 style={{ fontSize: 32, marginTop: 32 }}>Checkout</h1>
      <CheckoutForm bank={bankConfig()} />
    </>
  );
}
