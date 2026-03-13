"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white">
            AI AGENCY
          </Link>
        </div>
        
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link href="/" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Home
          </Link>
          <Link href="#services" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Services
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Pricing
          </Link>
          <Link href="#contact" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
            Book Call
          </Button>
        </div>
      </div>
    </nav>
  );
}
