import type { NextAuthConfig } from "next-auth";

export default {
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith("/admin");
      const isLogin = request.nextUrl.pathname === "/admin/login";

      if (isLogin) return true;
      if (isAdmin) return !!auth?.user;

      return true;
    },
  },
} satisfies NextAuthConfig;
