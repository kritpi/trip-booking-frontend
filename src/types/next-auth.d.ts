import { UserRole } from "@/enum/UserRole";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpire?: number;
    refreshTokenExpire?: number;
    user?: User;
  }

  // Overwrite User payload in node_modules/next-auth
  interface User {
    id?: string;
    email?: string;
    username?: string;
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    refreshTokenExpire?: number;
    accessTokenExpire?: number;
    refreshToken?: string;
    accessToken?: string;
    exp?: number;
    iat?: number;
    jti?: string;
  }
}