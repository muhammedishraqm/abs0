"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Contact } from "@/components/sections/contact";
import LoginPage from "./login/page";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  // If no user, show the login screen (acting as the entry gate).
  if (!user) {
    return <LoginPage />;
  }

  // Once authenticated, show the core application tab
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col animate-in fade-in duration-700">
      <Hero />
      <div className="space-y-32 lg:space-y-48 pb-32">
        <Pricing />
        <Contact />
      </div>
    </main>
  );
}
