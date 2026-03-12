import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseServer } from "@/lib/supabase/server";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const { data, error } = await supabaseServer.auth.signInWithPassword({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (error) {
          console.error("Message: ", error.message);
          throw new Error("Email ou senha inválidos");
        } else {
          if (process.env.NODE_ENV == "test") {
            console.log("dados", data);
          }
        }

        return {
          id: data.user.id,
          email: data.user.email,
          supabaseAccessToken: data.session?.access_token,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // No login (primeira vez), o objeto 'user' está disponível
      // do lado do servidor eu consigo o 'token const token = await getToken({ req });'
      if (user) {
        token.id = user.id;
        token.supabaseAccessToken = user.supabaseAccessToken;
      }
      return token;
    },

    async session({ session, token }) {
      // Aqui você define o que o useSession() ou getServerSession() vai ler
      // lado do cliente
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
