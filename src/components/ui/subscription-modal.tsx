"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Loader2, CreditCard, Calendar, Activity } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

interface SubscriptionData {
  subscriptionTier: string;
  startDate: string | null;
  endDate: string | null;
  amountPaid: string;
  amountDue: string;
}

export function SubscriptionModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [subData, setSubData] = useState<SubscriptionData>({
    subscriptionTier: "free",
    startDate: null,
    endDate: "Never (Lifetime)",
    amountPaid: "$0.00",
    amountDue: "$0.00",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchSubscription(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSubscription = async (uid: string) => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const tier = data.subscriptionTier?.toLowerCase() || "free";
        
        let startDateValue = "Unknown";
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          startDateValue = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }

        // Dummy logic: If real data had an end date, we would use it. Otherwise, default logic based on tier.
        if (tier === "free") {
          setSubData({
            subscriptionTier: "Free Plan",
            startDate: startDateValue,
            endDate: "-",
            amountPaid: "$0.00",
            amountDue: "$0.00",
          });
        } else {
          // If they happened to have a paid tier set in DB
          setSubData({
            subscriptionTier: data.subscriptionTier || tier,
            startDate: startDateValue,
            endDate: data.endDate ? data.endDate.toDate().toLocaleDateString() : "Active",
            amountPaid: data.amountPaid ? `$${data.amountPaid}` : "$Paid",
            amountDue: data.amountDue ? `$${data.amountDue}` : "$0.00",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              Your Subscription
            </DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400">
            Current billing period and plan details.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-zinc-400">Current Plan</span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                  {subData.subscriptionTier}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-zinc-800/50 pb-3">
                  <span className="text-sm text-zinc-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Start Date
                  </span>
                  <span className="text-sm font-medium text-white">{subData.startDate}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-3">
                  <span className="text-sm text-zinc-500 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> End Date
                  </span>
                  <span className="text-sm font-medium text-white">{subData.endDate}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-3">
                  <span className="text-sm text-zinc-500">Amount Paid</span>
                  <span className="text-sm font-medium text-emerald-400">{subData.amountPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500">Amount Due</span>
                  <span className="text-sm font-medium text-white">{subData.amountDue}</span>
                </div>
              </div>
            </div>

            {subData.subscriptionTier.toLowerCase() === "free plan" && (
              <Button 
                onClick={() => setOpen(false)}
                className="w-full bg-white text-zinc-950 font-bold hover:bg-zinc-200"
              >
                Upgrade to Premium
              </Button>
            )}
            
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
