"use client";
import { User } from "@/types/User";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user?.aud != "authenticated") {
        router.push("/login");
        return;
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <button
        className="bg-blue-300 px-4 py-2 rounded-2xl cursor-pointer"
        onClick={() => router.push("/chat")}
      >
        Proceed to submit Resume
      </button>
    </div>
  );
}
