"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Community" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const path = usePathname();
  const { count } = useCart();
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand">
          <Logo size={38} />
          <span>
            UnifyGames
            <small>JOIN THE CLUB</small>
          </span>
        </Link>
        <nav className="nav">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={path === l.href ? "active" : ""}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="grow" />
        <Link href="/cart" className="btn ghost sm cart-btn">
          🛒 Cart
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
