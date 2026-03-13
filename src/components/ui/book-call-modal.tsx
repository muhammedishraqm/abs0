"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  User 
} from "firebase/auth";

export function BookCallModal({ 
  children, 
  selectedPackage = "General Discovery" 
}: { 
  children: React.ReactNode;
  selectedPackage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    timeframe: "",
    package: selectedPackage
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
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
    }
  };

  // Update package if the prop changes
  React.useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      package: selectedPackage 
    }));
  }, [selectedPackage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create document without awaiting the server response for instant UI feedback
      addDoc(collection(db, "bookings"), {
        ...formData,
        userId: user?.uid || "anonymous", // Track the user if signed in
        type: formData.package,
        status: user ? "verified_email" : "pending",
        createdAt: serverTimestamp(),
      }).catch(error => {
        console.error("Firestore background error:", error);
      });

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2500);
    } catch (error) {
      console.error("Error booking call:", error);
      alert("Failed to request call. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setFormData({ 
      name: user?.displayName || "", 
      email: user?.email || "", 
      phone: "", 
      company: "", 
      timeframe: "",
      package: selectedPackage
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setTimeout(resetForm, 300);
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <DialogTitle className="text-2xl text-white">Request Sent</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Thank you, {formData.name.split(' ')[0]}. We've received your request for the <span className="text-white font-semibold">{formData.package}</span> package. We will contact you at {formData.phone} shortly.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-white">Book a Strategy Call</DialogTitle>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                  {formData.package}
                </span>
              </div>
              <DialogDescription className="text-zinc-400">
                Enter your details below to schedule your architectural consultation.
              </DialogDescription>
            </DialogHeader>

            {!user && (
              <Button 
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 mb-4 h-12"
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign in with Google to Auto-fill
              </Button>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Mohammed Rashid" 
                    required 
                    readOnly={!!user && !!user.displayName}
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="+971 50 123 4567" 
                    required 
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Professional Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@enterprise.ae" 
                  required 
                  readOnly={!!user}
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-white">Organization</Label>
                <Input 
                  id="company" 
                  placeholder="Abu Dhabi Tech Partners" 
                  required 
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeframe" className="text-white">Preferred Launch Window</Label>
                <Input 
                  id="timeframe" 
                  placeholder="e.g. Q3 2026" 
                  required 
                  value={formData.timeframe}
                  onChange={handleChange}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black hover:bg-zinc-200 mt-4 h-12 font-bold"
              >
                {loading ? (
                  <>
                    Processing...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Confirm Booking Request"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
