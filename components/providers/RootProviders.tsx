// components/providers/RootProviders.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import SignupGateProvider from "./SignUpGateProvider";

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SignupGateProvider>{children}</SignupGateProvider>
    </SessionProvider>
  );
}
