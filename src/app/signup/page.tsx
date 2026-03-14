"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      // 1. Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2. Check if user document already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // 3. If they don't exist (First time logging in), create their profile
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || "Unknown",
          email: user.email,
          subscriptionTier: "free",
          createdAt: serverTimestamp(),
        });
      }

      // 4. Redirect to homepage after successful login/signup
      router.push("/");
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError("Auth Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="space-y-2 text-center mt-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Access Your Account
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Sign in or create an account using your Google credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          {error && (
             <div className="text-red-500 text-sm font-medium mb-4 p-3 bg-red-500/10 rounded-md border border-red-500/20 text-center">
               {error}
             </div>
          )}

          <Button 
            type="button"
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-800 h-14 font-bold text-base"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
            )}
            {loading ? "Authenticating..." : "Continue with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
