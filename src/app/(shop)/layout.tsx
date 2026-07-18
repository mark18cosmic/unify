import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="container" style={{ minHeight: "70vh", paddingBottom: 40 }}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
