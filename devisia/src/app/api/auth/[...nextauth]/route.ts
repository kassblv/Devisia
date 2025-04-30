import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma";
import { supabase } from "@/infrastructure/supabase/supabaseClient";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        let user;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
        } catch (dbError: any) {
          console.error("Erreur de base de données:", dbError);
          throw new Error(`Erreur de base de données: ${dbError.message}`);
        }

        if (!user) {
          throw new Error("Aucun compte trouvé avec cet email");
        }

        let isPasswordValid;
        try {
          isPasswordValid = await compare(credentials.password, user.password);
        } catch (passwordError) {
          console.error("Erreur lors de la vérification du mot de passe:", passwordError);
          throw new Error("Erreur de vérification du mot de passe");
        }

        if (!isPasswordValid) {
          throw new Error("Mot de passe incorrect");
        }

        // Synchroniser avec Supabase pour les fonctionnalités avancées
        try {
          const { data: supabaseUser, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            console.error("Erreur de connexion Supabase:", error);
            
            // Gérer explicitement différents types d'erreurs
            if (error.code === 'email_not_confirmed') {
              // En environnement de développement, on continue malgré l'erreur
              console.warn("Email non confirmé, mais l'authentification est autorisée en développement");
              
              // Pour une application de production, on pourrait vouloir bloquer l'accès
              // et offrir la possibilité de renvoyer un email de confirmation
              if (process.env.NODE_ENV === 'production') {
                // await supabase.auth.resendConfirmationEmail({ email: credentials.email });
                // throw new Error("Veuillez confirmer votre adresse email avant de vous connecter");
              }
            } else if (error.code === 'invalid_credentials') {
              // Ne pas bloquer l'authentification NextAuth même si Supabase n'est pas content
              console.warn("Identifiants Supabase invalides, mais l'authentification Prisma a réussi");
            } else if (error.code !== 'email_not_confirmed') {
              // Pour les autres erreurs Supabase en production, on pourrait vouloir bloquer
              console.warn(`Erreur Supabase (${error.code}): ${error.message}`);
              if (process.env.NODE_ENV === 'production') {
                // throw new Error(`Erreur d'authentification: ${error.message}`);
              }
            }
          }
        } catch (supabaseError: any) {
          // Gérer les erreurs réseau ou autres avec Supabase
          console.error("Erreur inattendue avec Supabase:", supabaseError);
          // En dev, on continue quand même l'authentification (avec Prisma seulement)
          if (process.env.NODE_ENV === 'production') {
            // throw new Error(`Erreur de connexion: ${supabaseError.message}`);
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
