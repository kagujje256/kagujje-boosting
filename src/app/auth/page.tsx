"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Zap, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Auto-generate email from username
  const getEmail = () => `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@boost.kagujje.com`;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    const email = getEmail();

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        });
        if (error) throw error;
        
        // Check if user already exists
        if (data.user && !data.session) {
          toast.success("Account created! You can now sign in.");
          setIsSignUp(false);
        } else {
          toast.success("Welcome to KAGUJJE Boost!");
          router.push("/dashboard");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      if (message.includes("already registered")) {
        toast.error("Username already taken. Try another.");
      } else if (message.includes("Invalid login")) {
        toast.error("Invalid username or password");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mb-8 text-center">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-xl bg-[var(--accent)] text-black font-bold mb-4">
            <Zap size={28} />
          </div>
          <h1 className="text-2xl font-bold">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            {isSignUp ? "Start boosting your social media today" : "Sign in to continue"}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          {/* Google Auth */}
          <button
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-3 font-medium transition-all hover:bg-[var(--bg-primary)] disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4 20.25 7.78 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.78 1 4 3.58 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-[var(--border)]" />
            <span className="text-sm text-[var(--text-secondary)]">or</span>
            <div className="flex-1 border-t border-[var(--border)]" />
          </div>

          {/* Username/Password Auth */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="yourusername"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-3 pl-10 pr-4 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] py-3 pl-10 pr-4 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--accent)] py-3 font-semibold text-black transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[var(--accent)] hover:underline font-medium"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
