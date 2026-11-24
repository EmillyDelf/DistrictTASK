
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/db";
import User from "@/models/User";

import {
  checkLoginIp,
  isEmailBlocked,
  recordEmailFailure,
  clearEmailFailures,
} from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",

      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials, req) {
        // Identificação do IP do cliente.
        let clientIp: string;

        if (process.env.VERCEL === "1") {
          const forwardedFor = req.headers?.["x-forwarded-for"];

          const headerValue = Array.isArray(forwardedFor)
            ? forwardedFor[0]
            : forwardedFor;

          clientIp = headerValue?.split(",")[0]?.trim() ?? "";

          if (!clientIp) {
            throw new Error("Não foi possível identificar o IP do cliente.");
          }
        } else if (process.env.NODE_ENV !== "production") {
          clientIp = "development-local";
        } else {
          throw new Error("Ambiente de produção não identificado.");
        }

        // Limite por IP: contabiliza todas as tentativas.
        const ipCheck = await checkLoginIp(clientIp);

        if (!ipCheck.allowed) {
          throw new Error("RATE_LIMITED_IP");
        }

        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email) {
          return null;
        }

        // Verifica bloqueio temporário por e-mail.
        const emailBlocked = await isEmailBlocked(email);

        if (emailBlocked) {
          throw new Error("RATE_LIMITED_EMAIL");
        }

        if (!password) {
          await recordEmailFailure(email);
          return null;
        }

        await dbConnect();

        const user = await User.findOne({ email }).select("+password");

        // Usuário inexistente também representa falha de autenticação.
        if (!user) {
          await recordEmailFailure(email);
          return null;
        }

        const passwordIsValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordIsValid) {
          await recordEmailFailure(email);
          return null;
        }

        // Login bem-sucedido: limpa as falhas daquele e-mail.
        await clearEmailFailures(email);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};
