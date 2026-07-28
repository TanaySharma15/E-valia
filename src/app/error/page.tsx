import Link from "next/link";
import { Button } from "@/components/ui/button";

function friendlyMessage(raw: string | undefined): {
  title: string;
  detail: string;
} {
  if (!raw) {
    return {
      title: "Something went wrong",
      detail: "Please try again in a moment.",
    };
  }

  const lower = raw.toLowerCase();

  if (lower.includes("user already registered")) {
    return {
      title: "You already have an account",
      detail:
        "An account with this email already exists. Try logging in instead.",
    };
  }

  if (lower.includes("invalid login credentials")) {
    return {
      title: "Incorrect email or password",
      detail: "Double-check your details and try again.",
    };
  }

  if (lower.includes("email not confirmed")) {
    return {
      title: "Confirm your email first",
      detail: "Check your inbox for a confirmation link before logging in.",
    };
  }

  if (lower.includes("password") && lower.includes("6")) {
    return {
      title: "Password too short",
      detail: "Your password needs to be at least 6 characters.",
    };
  }

  return {
    title: "Something went wrong",
    detail: raw,
  };
}

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const { title, detail } = friendlyMessage(params.message);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]">
          <svg
            className="h-6 w-6 text-[#BE123C]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-[#181B21]">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{detail}</p>

        <div className="mt-8 flex flex-col gap-2.5">
          <Button
            asChild
            className="h-11 w-full rounded-lg bg-[#181B21] text-sm font-medium text-white hover:bg-[#2A2E37]"
          >
            <Link href="/login">Back to login</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-lg border-[#E3E0D8] text-sm font-medium text-[#181B21] hover:bg-[#F5F3EE]"
          >
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
