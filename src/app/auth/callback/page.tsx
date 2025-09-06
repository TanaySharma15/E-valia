"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error);
        router.push("/login");
        return;
      }

      if (session) {
        router.push("/resume");
      } else {
        router.push("/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center font-bold text-5xl font-serif">
      Finishing sign-in...
    </div>
  );
}
