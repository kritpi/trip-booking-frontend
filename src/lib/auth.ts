import type { AuthOptions, Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "@/lib/axios.config";
import { JWT } from "next-auth/jwt";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          const res = await axios.post("/auth/login", {
            email: credentials?.email,
            password: credentials?.password,
          });
          if (res.status === 200) {
            return res.data;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        return { ...token, ...user };
      }

      if (
        token.accessTokenExpires &&
        typeof token.accessTokenExpires === "number"
      ) {
        if (Date.now() < token.accessTokenExpires) {
          return token;
        }
      }

      if (token.refreshToken) {
        try {
          const res = await axios.post("/auth/refresh", {
            refreshToken: token.refreshToken,
          });

          if (res.status === 200) {
            return { ...token, ...res.data };
          }
        } catch (error) {
          console.log(error);
          return token;
        }
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (
        token.accessTokenExpires &&
        typeof token.accessTokenExpires === "number" &&
        Date.now() / 1000 > token.accessTokenExpires &&
        token.refreshTokenExpires &&
        typeof token.refreshTokenExpires === "number" &&
        Date.now() / 1000 > token.refreshTokenExpires
      ) {
        return Promise.reject({
          error: new Error(
            "Refresh token has expired. Please log in again to get a new refresh token."
          ),
        });
      }

      if (token.accessToken && typeof token.accessToken === "string") {
        const accessTokenData = JSON.parse(
          atob(token.accessToken.split(".")[1])
        );
        session.user = accessTokenData;
        token.accessTokenExpires = accessTokenData.exp;

        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
