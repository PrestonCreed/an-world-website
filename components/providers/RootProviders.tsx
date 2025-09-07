// components/providers/RootProviders.tsx
"use client";

import SignupGateProvider from "./SignUpGateProvider";

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return <SignupGateProvider>{children}</SignupGateProvider>;
}

