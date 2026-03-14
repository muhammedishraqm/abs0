"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/hooks/useUserData";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { userData, loading } = useUserData();

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-3xl mx-auto">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64 bg-zinc-800" />
          <Skeleton className="h-4 w-96 bg-zinc-800" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-3xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">User Info</h1>
        <p className="text-zinc-400">Manage your account preferences and identity.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-zinc-400">Your identity is securely verified via Google Login.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-300">Full Name</Label>
            <Input 
              readOnly 
              value={userData?.name || "Unknown User"} 
              className="bg-zinc-950 border-zinc-800 text-zinc-400 font-medium h-12" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Email Address</Label>
            <Input 
              readOnly 
              value={userData?.email || "No Email Found"} 
              className="bg-zinc-950 border-zinc-800 text-zinc-400 font-medium h-12" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Subscription Tier</Label>
            <Input 
              readOnly 
              value={(userData?.subscriptionTier || "Free Plan").toUpperCase()} 
              className="bg-zinc-950 border-emerald-500/50 text-emerald-400 font-bold h-12 tracking-wider" 
            />
          </div>
          
          <div className="pt-4">
            <Button disabled className="w-full bg-zinc-800/50 text-zinc-500 border border-zinc-800 h-12 font-medium hover:bg-zinc-800/50">
              Verified Account (No Changes Needed)
            </Button>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
