import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: {
    default: "UnifyGames — PS5 Games in the Maldives",
    template: "%s · UnifyGames",
  },
  description:
    "Buy PS5 games from UnifyGames — the Maldives' Unify Games Club. Bank transfer or cash on delivery. Join the club.",
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100" fill="#F26522"/><path d="M70,55 L70,113 C70,131 84,146 100,146 C116,146 130,131 130,113 L130,55" fill="none" stroke="#fff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></svg>`
          ),
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
