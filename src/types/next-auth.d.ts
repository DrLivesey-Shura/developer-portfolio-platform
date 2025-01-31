// src/types/next-auth.d.ts
import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: string;
  }
}
