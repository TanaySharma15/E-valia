"use client";

import { login, signup } from "./action";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const id = authData.user?.id;
      if (id) {
        router.push("/resume");
      }
    }
    getUser();
  }, []);
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button formAction={login} className="w-full">
                Log in
              </Button>
              <Button formAction={signup} variant="outline" className="w-full">
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
