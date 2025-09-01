"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ProfilePhoto } from "./UserProfilePhoto";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<string | undefined>();
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user?.id) {
        setLoggedIn(true);
        setUser(authData.user.email);
      }
    };
    checkAuth();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed mb-10 top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border custom-shadow"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center animate-slide-in-left">
            <Link
              href="/"
              className="text-3xl font-bold gradient-text hover:scale-105 transition-transform duration-300"
            >
              Evalia
            </Link>
            <div className="ml-2 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                href="/"
                className="relative text-foreground hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary/5 group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/how-it-works"
                className="relative text-muted-foreground hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary/5 group"
              >
                How it works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/pricing"
                className="relative text-muted-foreground hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary/5 group"
              >
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {loggedIn === false ? (
            <div className="flex items-center space-x-4 animate-fade-in-up">
              <Button
                variant="ghost"
                asChild
                className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 animate-fade-in-up">
              <Button
                variant="ghost"
                asChild
                className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
              >
                <Link href="/user">
                  <ProfilePhoto />
                  {user}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
