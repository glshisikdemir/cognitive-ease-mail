import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Mail, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { PilotNotice } from "@/components/PilotNotice";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in · ISURA" },
      {
        name: "description",
        content: "Sign in to ISURA — your AI cognitive inbox assistant.",
      },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choice" | "email">("choice");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [sent, setSent] = useState(false);

  const onGoogle = async () => {
    setLoading("google");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/onboarding` },
      });
      if (error) throw error;
      // Browser will redirect to Google.
    } catch (err) {
      setLoading(null);
      const message =
        err instanceof Error ? err.message : "Could not start Google sign-in.";
      toast.error(message);
    }
  };

  const onEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading("email");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
      setLoading(null);
      setSent(true);
      toast.success("Magic link sent. Check your inbox.");
    } catch (err) {
      setLoading(null);
      const message =
        err instanceof Error
          ? err.message
          : "We couldn't send the magic link. Please try again.";
      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium tracking-tight text-foreground"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          ISURA
        </Link>
      </header>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-foreground">
              Welcome to ISURA
            </h1>
            <p className="mt-3 text-[15px] text-muted-foreground">
              Sign in to access your cognitive inbox assistant
            </p>
          </div>

          <div className="mb-6">
            <PilotNotice variant="banner" />
          </div>

          {sent ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-muted">
                <Mail className="h-5 w-5 text-foreground" />
              </div>
              <h2 className="text-base font-medium text-foreground">
                Check your inbox
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We sent a magic link to{" "}
                <span className="text-foreground">{email}</span>.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setMode("choice");
                  setEmail("");
                }}
                className="mt-5 text-sm text-muted-foreground hover:text-foreground transition"
              >
                Use a different method
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={onGoogle}
                disabled={loading !== null}
                className="w-full inline-flex items-center justify-center gap-3 h-11 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {loading === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>

              {mode === "choice" ? (
                <button
                  onClick={() => setMode("email")}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted/40 transition"
                >
                  <Mail className="h-4 w-4" />
                  Email magic link
                </button>
              ) : (
                <form onSubmit={onEmail} className="space-y-2">
                  <input
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@work.com"
                    className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading !== null}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted/40 transition disabled:opacity-60"
                  >
                    {loading === "email" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Send magic link
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Trust */}
          <div className="mt-10 space-y-1.5 text-center">
            <p className="text-xs text-muted-foreground">
              Secure authentication powered by modern OAuth
            </p>
            <p className="text-xs text-muted-foreground">
              No spam. No unnecessary emails.
            </p>
          </div>
        </div>
      </div>

      <footer className="px-6 py-5 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link to="/terms" className="text-foreground/80 hover:text-foreground underline-offset-4 hover:underline">Terms</Link>{" "}
          &{" "}
          <Link to="/privacy" className="text-foreground/80 hover:text-foreground underline-offset-4 hover:underline">Privacy</Link>.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <Link to="/security" className="hover:text-foreground">Security</Link>
          <Link to="/cookies" className="hover:text-foreground">Cookies</Link>
          <Link to="/ai-transparency" className="hover:text-foreground">AI transparency</Link>
          <Link to="/pilot-status" className="hover:text-foreground">Pilot status</Link>
        </div>
      </footer>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6-2.74-6-6.2s2.69-6.2 6-6.2c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.9 3.2 14.7 2.2 12 2.2 6.86 2.2 2.7 6.36 2.7 11.5S6.86 20.8 12 20.8c6.93 0 9.5-4.86 9.5-7.39 0-.5-.05-.88-.12-1.21H12z"
      />
    </svg>
  );
}
