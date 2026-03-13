"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    message: "",
  });

  // Listen for auth state
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData(prev => ({
          ...prev,
          name: currentUser.displayName || prev.name,
          email: currentUser.email || prev.email,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setFormData(prev => ({
        ...prev,
        name: result.user.displayName || prev.name,
        email: result.user.email || prev.email,
      }));
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create document without awaiting the server response for instant UI feedback
      addDoc(collection(db, "automation_suggestion"), {
        ...formData,
        userId: user?.uid || "anonymous",
        createdAt: serverTimestamp(),
      }).catch(error => {
        console.error("Firestore background error:", error);
      });
      
      setIsSubmitted(true);
      setFormData({ 
        name: user?.displayName || "", 
        business: "", 
        email: user?.email || "", 
        message: "" 
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section id="contact" className="bg-zinc-950 py-24 px-6 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Secure Your Advantage
          </h2>
          <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Let&apos;s Architect Your AI Future.
          </h3>
          <p className="mx-auto max-w-xl text-lg text-zinc-400">
            Our specialists will reach out within 24 hours to schedule your 
            initial architectural consultation.
          </p>
        </div>

        {isSubmitted ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
            <p className="text-zinc-400">Your vision is now being processed. Our architects will contact you shortly.</p>
            <Button 
                variant="outline" 
                className="mt-8 border-zinc-700 text-white hover:bg-zinc-800"
                onClick={() => setIsSubmitted(false)}
            >
                Send Another Message
            </Button>
          </div>
        ) : (
          <div className="space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 shadow-2xl backdrop-blur-sm lg:p-12">
            {!user && (
              <div className="pb-4 border-b border-zinc-800/50">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full border-zinc-800 bg-zinc-950/50 text-white hover:bg-zinc-900 h-12"
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                  Sign in with Google to Auto-fill
                </Button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-zinc-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Mohammed bin Rashid"
                    className="h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business" className="text-sm font-medium text-zinc-300">
                    Business Name
                  </Label>
                  <Input
                    id="business"
                    required
                    value={formData.business}
                    onChange={handleChange}
                    placeholder="Enterprise Alpha"
                    className="h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abcd@gamil.com"
                  className="h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-zinc-300">
                  Automation Needs
                </Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Briefly describe the bottlenecks you seek to automate..."
                  className="min-h-[150px] border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                />
              </div>

              <Button 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-all text-base disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    Processing...
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Request Architectural Review
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-zinc-500 font-medium italic">
            Specializing in sovereign AI solutions for the UAE market.
          </p>
          <div className="mt-8 flex justify-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            <span>Dubai Design District</span>
            <span>·</span>
            <span>Abu Dhabi Global Market</span>
          </div>
        </div>
      </div>
    </section>
  );
}
