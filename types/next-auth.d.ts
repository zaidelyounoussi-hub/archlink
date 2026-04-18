// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CLIENT" | "ARCHITECT";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "CLIENT" | "ARCHITECT";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "CLIENT" | "ARCHITECT";
  }
}
