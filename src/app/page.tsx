"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user?.aud != "authenticated") {
        router.push("/login");
        return;
      } else {
        router.push("/resume");
      }
    }
    fetchUser();
  }, [supabase.auth]);

  return <div className="flex justify-center items-center w-full h-full"></div>;
}
