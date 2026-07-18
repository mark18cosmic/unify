import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(creds) {
        const email = String(creds?.email || "")
          .toLowerCase()
          .trim();

        const password = String(creds?.password || "");

        if (!email || !password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: {
            email,
          },
        });

        if (!admin) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          admin.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        };
      },
    }),
  ],
});
