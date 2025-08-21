"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Evalia
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/how-it-works"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                How it works
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
