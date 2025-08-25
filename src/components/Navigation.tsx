"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
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
        </div>
      </div>
    </nav>
  );
}
