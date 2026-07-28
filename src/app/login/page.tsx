"use client";

import { login, signup } from "./action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    async function getUser() {
      const { data: authData } = await supabase.auth.getUser();
      const id = authData.user?.id;
      if (id) {
        router.push("/resume");
      }
    }
    getUser();
  }, []);
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) console.error("Google sign-in error:", error.message);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FBFAF7]">
      <style>{`
        @keyframes evalia-wave {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        @keyframes evalia-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .evalia-bar {
          animation: evalia-wave 1.4s ease-in-out infinite;
          transform-origin: center;
        }
        .evalia-dot {
          animation: evalia-pulse 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* Left panel — signature waveform / brand side */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#12151C] px-14 py-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #F3F1EA 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#34D399] evalia-dot" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#9CA3AF]">
            Evalia — AI Interview Coach
          </span>
        </div>

        <div className="relative space-y-8">
          <div className="flex items-end gap-1.5" aria-hidden="true">
            {[18, 34, 52, 30, 44, 20, 38, 56, 26, 42, 16, 34].map((h, i) => (
              <span
                key={i}
                className="evalia-bar w-1.25 rounded-full bg-linear-to-t from-[#34D399] to-[#F5B942]"
                style={{
                  height: `${h}px`,
                  animationDelay: `${i * 0.09}s`,
                }}
              />
            ))}
          </div>

          <h1 className="max-w-md text-4xl font-semibold leading-[1.15] tracking-tight text-[#F3F1EA]">
            Practice out loud.
            <br />
            Walk in ready.
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-[#9CA3AF]">
            Upload your resume, get role-specific questions, and rehearse with a
            live voice interviewer before the one that counts.
          </p>
        </div>

        <p className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-[#5B6270]">
          Session ready · Mic check passed
        </p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#34D399] evalia-dot" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#6B7280]">
                Evalia
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-[#181B21]">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-[#6B7280]">
            Sign in to keep practicing.
          </p>

          <form className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-[#4B5563]"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-11 rounded-lg border-[#E3E0D8] bg-white text-sm focus-visible:border-[#34D399] focus-visible:ring-[#34D399]/30"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-[#4B5563]"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-11 rounded-lg border-[#E3E0D8] bg-white text-sm focus-visible:border-[#34D399] focus-visible:ring-[#34D399]/30"
              />
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                formAction={login}
                className="h-11 w-full rounded-lg bg-[#181B21] text-sm font-medium text-white hover:bg-[#2A2E37]"
              >
                Log in
              </Button>
              <Button
                formAction={signup}
                variant="outline"
                className="h-11 w-full rounded-lg border-[#E3E0D8] text-sm font-medium text-[#181B21] hover:bg-[#F5F3EE]"
              >
                Sign up
              </Button>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-[#E9E6DD]" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#9CA3AF]">
                or
              </span>
              <div className="h-px flex-1 bg-[#E9E6DD]" />
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="h-11 w-full gap-2.5 rounded-lg border-[#E3E0D8] bg-white text-sm font-medium text-[#181B21] hover:bg-[#F5F3EE]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.9 39.6 16.4 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.6 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              Continue with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
