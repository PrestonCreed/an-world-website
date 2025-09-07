// app/(auth)/signin/page.tsx
"use client";

/**
 * Sign in / Sign up
 * - Inputs allow copy/paste (no paste-blocking handlers)
 * - Password fields include a reveal (eye) toggle
 * - Matches site font/tokens; unified clean card layout
 * - Google sign-in button via NextAuth
 * - Magic link (passwordless) flow with explanation
 */

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/logo";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const params = useSearchParams();
  const router = useRouter();
  const returnTo = params.get("returnTo") || "/";

  const [mode, setMode] = useState<Mode>("signin");
  const nextAuthError = params.get("error");

  return (
    <main className="font-sans text-an-fg">
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          {/* Brand */}
          <div className="flex items-center justify-center mb-8">
            <Logo className="h-9 w-auto" />
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-mist">
            {/* Card header */}
            <div className="px-6 pt-6">
              <h1 className="text-2xl font-semibold">Welcome</h1>
              <p className="opacity-70 mt-1 text-sm">
                Sign in to your account or create a new one.
              </p>

              {/* Mode switch */}
              <div className="mt-5 inline-flex rounded border border-white/20 overflow-hidden">
                <button
                  className={`px-4 py-2 text-sm transition ${
                    mode === "signin"
                      ? "bg-an-blue-light text-white"
                      : "bg-transparent hover:bg-white/10"
                  }`}
                  onClick={() => setMode("signin")}
                  type="button"
                >
                  Sign in
                </button>
                <button
                  className={`px-4 py-2 text-sm transition ${
                    mode === "signup"
                      ? "bg-an-blue-light text-white"
                      : "bg-transparent hover:bg-white/10"
                  }`}
                  onClick={() => setMode("signup")}
                  type="button"
                >
                  Create account
                </button>
              </div>

              {nextAuthError && (
                <div className="mt-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm">
                  There was a problem: <span className="font-medium">{nextAuthError}</span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-6 pb-6 pt-4">
              {/* Social auth */}
              <div className="space-y-3">
                <GoogleButton
                  onClick={() => signIn("google", { callbackUrl: returnTo })}
                />
              </div>

              {/* Divider */}
              <Divider label="or continue with email" />

              {/* Auth forms */}
              {mode === "signin" ? (
                <SignInForm returnTo={returnTo} />
              ) : (
                <SignUpForm
                  onSuccess={() =>
                    router.push(`/onboarding?returnTo=${encodeURIComponent(returnTo)}`)
                  }
                />
              )}

              {/* Magic link info / action */}
              <MagicLinkBlock returnTo={returnTo} />
            </div>
          </div>

          {/* Footer smallprint */}
          <p className="mt-4 text-center text-xs opacity-60">
            By continuing, you agree to our Terms and acknowledge our Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}

/* ----------------------------- Google Button ----------------------------- */

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Continue with Google"
      className="w-full inline-flex items-center justify-center gap-3 rounded border border-white/20 bg-white text-neutral-900 px-4 py-2 font-medium hover:opacity-95 active:opacity-90 transition"
    >
      {/* Google "G" mark */}
      <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.59 32.155 29.18 35 24 35c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.31 0 6.31 1.23 8.6 3.23l5.66-5.66C34.46 3.42 29.48 1 24 1 11.85 1 2 10.85 2 23s9.85 22 22 22 22-9.85 22-22c0-1.47-.16-2.9-.389-4.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.6 16.2 18.94 13 24 13c3.31 0 6.31 1.23 8.6 3.23l5.66-5.66C34.46 3.42 29.48 1 24 1 16.18 1 9.24 5.06 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 45c5.11 0 9.74-1.97 13.26-5.18l-6.12-5.17C29.76 36.79 27.05 38 24 38c-5.16 0-9.55-3.33-11.1-7.95l-6.56 5.05C9.24 40.94 16.18 45 24 45z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.02 2.98-3.26 5.49-6.163 7.13l.001.001 6.12 5.17C37.8 40.38 42 35.58 42 28c0-1.47-.16-2.9-.389-4.917z"/>
      </svg>
      Continue with Google
    </button>
  );
}

/* -------------------------------- Divider -------------------------------- */

function Divider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-white/10" />
      <div className="text-xs uppercase tracking-wide opacity-60">{label}</div>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

/* ------------------------------- Sign In Form ------------------------------ */

function SignInForm({ returnTo }: { returnTo: string }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await signIn("credentials", {
      identifier,
      password,
      callbackUrl: returnTo,
      redirect: false,
    });
    if (res?.error) {
      setErr("Invalid email/username or password.");
      setBusy(false);
    } else {
      window.location.assign(returnTo);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Input
        id="signin-identifier"
        label="Email or Username"
        type="text"
        placeholder="you@domain.com or username"
        value={identifier}
        onChange={(v) => setIdentifier(v)}
        autoComplete="username"
      />
      <Input
        id="signin-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(v) => setPassword(v)}
        autoComplete="current-password"
      />

      {err && <p className="text-sm text-red-400">{err}</p>}

      <button
        type="submit"
        disabled={busy || !identifier || !password}
        className="w-full rounded px-4 py-2 bg-an-blue-light text-white font-medium hover:bg-an-blue-mid disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

/* ------------------------------- Sign Up Form ------------------------------ */

function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, newsletter }),
      });

      if (res.ok) {
        onSuccess();
        return;
      }

      const j = (await res.json().catch(() => null)) as any;
      setErr(j?.reason || "Sign up failed. Please try again.");
    } catch {
      setErr("Sign up failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Input
        id="signup-email"
        label="Email"
        type="email"
        placeholder="you@domain.com"
        value={email}
        onChange={(v) => setEmail(v)}
        autoComplete="email"
      />
      <Input
        id="signup-username"
        label="Create username"
        type="text"
        placeholder="username"
        value={username}
        onChange={(v) => setUsername(v)}
        autoComplete="username"
      />
      <Input
        id="signup-password"
        label="Create password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(v) => setPassword(v)}
        autoComplete="new-password"
      />

      <label className="mt-1 inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
        />
        <span>Sign me up for the newsletter</span>
      </label>

      {err && <p className="text-sm text-red-400">{err}</p>}

      <button
        type="submit"
        disabled={busy || !email || !username || !password}
        className="w-full rounded px-4 py-2 bg-an-blue-light text-white font-medium hover:bg-an-blue-mid disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {busy ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

/* ----------------------------- Magic Link Block ---------------------------- */

function MagicLinkBlock({ returnTo }: { returnTo: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    const res = await signIn("email", { email, callbackUrl: returnTo, redirect: false });
    if ((res as any)?.error) {
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        className="text-sm opacity-80 hover:opacity-100 underline underline-offset-4"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide magic link" : "Use a passwordless magic link instead"}
      </button>

      {open && (
        <form onSubmit={sendLink} className="mt-3 space-y-2" aria-live="polite">
          <p className="text-xs opacity-70">
            Magic links let you sign in without a password. We’ll email you a one-time secure link.
          </p>
          <Input
            id="magic-email"
            label="Email for magic link"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(v) => setEmail(v)}
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={status === "sending" || !email}
            className="w-full rounded px-4 py-2 bg-black text-white border border-white/20 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {status === "sending" ? "Sending…" : "Email me a magic link"}
          </button>
          {status === "sent" && (
            <p className="text-sm text-emerald-400">Check your inbox for the link. It expires shortly.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">Could not send link. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}

/* --------------------------------- Input ---------------------------------- */

function Input(props: {
  id: string;
  label: string;
  type: string; // "text" | "email" | "password" | ...
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  const { id, label, type, placeholder, value, onChange, autoComplete } = props;

  // For password fields, add show/hide toggle.
  const isPassword = type === "password";
  const [reveal, setReveal] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword ? (reveal ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          // Ensure best UX for pasting passwords/usernames:
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          // NOTE: We *do not* block paste. Copy-paste works as expected.
          className={`w-full rounded px-3 py-2 border border-neutral-300 bg-white
                      text-neutral-900 placeholder:text-neutral-500
                      focus:outline-none focus:ring-2 focus:ring-an-blue-light focus:border-an-blue-light
                      ${isPassword ? "pr-10" : ""}`}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={reveal ? "Hide password" : "Show password"}
            aria-pressed={reveal}
            onClick={() => setReveal((v) => !v)}
            className="absolute inset-y-0 right-0 px-2 flex items-center opacity-80 hover:opacity-100"
            tabIndex={0}
          >
            {/* Eye icon (toggles to eye-off) */}
            {reveal ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Icon Components --------------------------- */

function EyeIcon(props: { className?: string }) {
  // Heroicons style eye
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={props.className}
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322c1.49-3.293 4.93-5.822 9.214-5.822 4.284 0 7.724 2.529 9.214 5.822a.74.74 0 010 .656c-1.49 3.293-4.93 5.822-9.214 5.822-4.284 0-7.724-2.529-9.214-5.822a.74.74 0 010-.656z"
      />
      <circle cx="12" cy="12" r="3.25" />
    </svg>
  );
}

function EyeOffIcon(props: { className?: string }) {
  // Heroicons style eye-slash
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={props.className}
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223C5.86 5.91 8.74 4.5 12.002 4.5c4.284 0 7.724 2.529 9.214 5.822a.74.74 0 010 .656c-.827 1.829-2.176 3.416-3.89 4.521M6.53 6.53l10.94 10.94M9.877 9.877A3.25 3.25 0 0012 15.25c.6 0 1.161-.163 1.64-.447"
      />
    </svg>
  );
}
