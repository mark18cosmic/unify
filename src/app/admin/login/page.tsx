import { redirect } from "next/navigation";
import { signIn, auth } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Admin Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/admin");
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/admin",
      });
    } catch (e) {
      // NEXT_REDIRECT must be rethrown
      if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
      if ((e as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw e;
      redirect("/admin/login?error=1");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="panel" style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-block" }}><Logo size={54} /></div>
          <h1 style={{ fontSize: 24, marginTop: 12 }}>Admin Login</h1>
          <p className="muted" style={{ fontSize: 14 }}>UnifyGames dashboard</p>
        </div>
        {error && <div className="flash err">Invalid email or password.</div>}
        <form action={login}>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" required placeholder="admin@unifygames.mv" />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" required placeholder="••••••••" />
          </div>
          <button className="btn block" type="submit" style={{ marginTop: 8 }}>Sign in</button>
        </form>
      </div>
    </div>
  );
}
