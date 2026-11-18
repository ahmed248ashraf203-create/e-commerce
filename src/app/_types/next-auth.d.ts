import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    phone?: string;
    role?: string;
    apiToken?: string;
  }

  interface Session {
    user: {
      _id: string;
      phone?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiToken?: string;
    userId?: string;
    phone?: string;
    role?: string;
  }
}
