"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "📊 Dashboard" },
  { href: "/admin/products", label: "🎮 Games" },
  { href: "/admin/orders", label: "🧾 Orders" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="admin-nav">
      {links.map((l) => {
        const active = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={active ? "active" : ""}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
