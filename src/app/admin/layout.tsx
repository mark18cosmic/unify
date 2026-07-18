import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { AdminNav } from "@/components/AdminNav";

export const metadata = { title: "Admin · UnifyGames" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page renders without the shell
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/admin" className="brand">
          <Logo size={30} />
          <span>UnifyGames</span>
        </Link>
        <AdminNav />
        <div style={{ marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>{session.user.email}</div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button className="btn ghost sm block" type="submit">Sign out</button>
          </form>
          <Link href="/" className="muted" style={{ fontSize: 13, display: "block", marginTop: 12 }}>← View store</Link>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
