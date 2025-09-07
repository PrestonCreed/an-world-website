// components/providers/SignupGateProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { shouldGateOnNext, markPromptShown } from "../../lib/watch-gate";

declare global {
  interface Window {
    AWGate?: { register: (mediaId: string) => boolean };
  }
}

export default function SignupGateProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [show, setShow] = useState(false);
  const [returnTo, setReturnTo] = useState<string>("/");

  useEffect(() => {
    window.AWGate = {
      register: (mediaId: string) => {
        if (status === "authenticated") return true;
        if (shouldGateOnNext(mediaId)) {
          setReturnTo(`/watch/${mediaId}`);
          setShow(true);
          markPromptShown();
          return false;
        }
        return true;
      },
    };
    return () => {
      if (window.AWGate) delete window.AWGate;
    };
  }, [status]);

  return (
    <>
      {children}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-white rounded p-6">
            <h2 className="text-xl font-bold mb-2">Create your AN World account</h2>
            <p className="text-sm text-gray-600 mb-4">
              You’ve watched a show — create a free account to keep watching.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 rounded bg-black text-white py-2"
                onClick={() => signIn(undefined, { callbackUrl: `/signin?returnTo=${encodeURIComponent(returnTo)}` })}
              >
                Sign up / Sign in
              </button>
              <button className="flex-1 rounded border py-2" onClick={() => setShow(false)}>
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
