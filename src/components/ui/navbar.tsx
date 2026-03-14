"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookCallModal } from "@/components/ui/book-call-modal";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useUserData } from "@/hooks/useUserData";

export function Navbar() {
  const { user, userData, loading } = useUserData();

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
          {!user ? (
            <>
              <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              {userData?.subscriptionTier === 'free' && (
                <Link href="/#pricing">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all border-0">
                    Upgrade to Pro
                  </Button>
                </Link>
              )}

              {userData?.subscriptionTier === 'pro' && (
                <Link href="/dashboard">
                  <Button size="sm" variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800">
                    Go to Dashboard
                  </Button>
                </Link>
              )}

              <button 
                onClick={() => signOut(auth)}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                title="Logout"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
