// lib/auth.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { z } from "zod";
import { verifyPassword } from "@/lib/password";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function magicLinkEmailHtml(url: string, host: string) {
  const escapedHost = host.replace(/\./g, "&#8203;.");
  return `<body><p>Sign in to <b>${escapedHost}</b></p><p><a href="${url}">Click here to sign in</a></p></body>`;
}
function magicLinkEmailText(url: string, host: string) {
  return `Sign in to ${host}\n${url}\n`;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 }, // 1h
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        const parsed = z
          .object({ identifier: z.string().min(1), password: z.string().min(6) })
          .safeParse(creds);
        if (!parsed.success) return null;
        const { identifier, password } = parsed.data;

        const user =
          (await prisma.user.findUnique({ where: { email: identifier } })) ??
          (await prisma.user.findUnique({ where: { username: identifier } }));
        if (!user || !user.passwordHash) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, name: user.name ?? user.username ?? null, email: user.email ?? null };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Email({
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        if (!resend) throw new Error("RESEND_API_KEY not set");
        const { error } = await resend.emails.send({
          from: process.env.EMAIL_FROM as string,
          to: identifier,
          subject: "Sign in to AN World",
          html: magicLinkEmailHtml(url, new URL(url).host),
          text: magicLinkEmailText(url, new URL(url).host),
        });
        if (error) throw error;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (!token.roles && token.id) {
        const roles = await prisma.role.findMany({
          where: { users: { some: { userId: token.id } } },
          select: { name: true },
        });
        token.roles = roles.map((r) => r.name);
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          roles: (token.roles as string[]) ?? [],
        };
      }
      return session;
    },
  },
  pages: {
    // custom UI routes if you want later:
    // signIn: "/signin",
    // error: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

