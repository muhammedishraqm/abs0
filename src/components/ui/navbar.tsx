"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookCallModal } from "@/components/ui/book-call-modal";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading || !user) return null;
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-md bg-white p-1">
              <Image 
                src="/logo-new.jpg" 
                alt="ABSTRACT Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              ABSTRACT
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link href="/" className="text-sm font-medium text-white transition-colors hover:text-zinc-400 px-3 py-1 rounded-md hover:bg-zinc-900">
            Home
          </Link>
          <Link href="#services" className="text-sm font-medium text-white transition-colors hover:text-zinc-400 px-3 py-1 rounded-md hover:bg-zinc-900">
            Services
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-white transition-colors hover:text-zinc-400 px-3 py-1 rounded-md hover:bg-zinc-900">
            Pricing
          </Link>
          <Link href="#contact" className="text-sm font-medium text-white transition-colors hover:text-zinc-400 px-3 py-1 rounded-md hover:bg-zinc-900">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <SubscriptionModal>
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors mr-4 flex items-center gap-1">
              Billing
            </button>
          </SubscriptionModal>
          <button 
            onClick={() => signOut(auth)}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors mr-4"
          >
            Logout
          </button>
          <BookCallModal>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
              Book Call
            </Button>
          </BookCallModal>
        </div>
      </div>
    </nav>
  );
}
