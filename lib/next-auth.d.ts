// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // add custom fields here
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    // add custom fields here
  }
}
