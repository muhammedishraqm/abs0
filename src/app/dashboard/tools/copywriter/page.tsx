"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Check, Zap } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

export default function AICopywriterPage() {
  const { userData, loading } = useUserData();
  const isPro = userData?.subscriptionTier === "pro";

  if (loading) return null;

  return (
    <div className="relative min-h-screen">
      {!isPro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/20 backdrop-blur-[2px]">
          <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 shadow-[0_0_50px_rgba(16,185,129,0.15)] border-t-emerald-500/50">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Unlock AI Copywriter</CardTitle>
              <p className="text-zinc-400 text-sm">
                Generate high-converting sales copy, emails, and landing pages using our fine-tuned proprietary AI models.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/50 text-center">
                  <div className="text-xs text-zinc-500 mb-1">Unlimited Tokens</div>
                  <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/50 text-center">
                  <div className="text-xs text-zinc-500 mb-1">5+ Tone Profiles</div>
                  <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/#pricing'}
                className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold h-12 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className={`p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700 transition-all ${!isPro ? 'blur-md pointer-events-none' : ''}`}>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">AI Copywriter</h1>
          <p className="text-zinc-400">Draft elite-tier sales copy, emails, and social campaigns in seconds.</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 shadow-sm border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-14 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800 mb-6 shadow-inner">
              <PenTool className="h-10 w-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Draft Your First Campaign</h3>
            <p className="text-zinc-400 max-w-sm mx-auto mb-8 leading-relaxed">
              Select a framework (AIDA, PAS, BAB) and input your product details. Our model will generate tailored assets instantly.
            </p>
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold px-8 h-12 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Start Generation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
