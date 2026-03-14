"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PenTool, Check, Zap, Loader2 } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";

export default function AICopywriterPage() {
  const { user, userData, loading } = useUserData();
  const isPro = userData?.subscriptionTier === "pro";

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    if (!user) {
      toast.error("Authentication required.");
      return;
    }

    setIsGenerating(true);
    setResult("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate copy");
      }

      const data = await response.json();
      setResult(data.generatedText || "No content generated.");
      toast.success("Copy generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while generating copy.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

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

      <div className={`p-8 space-y-8 max-w-4xl mx-auto animate-in fade-in duration-700 transition-all ${!isPro ? 'blur-md pointer-events-none select-none grayscale-[0.5]' : ''}`}>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <PenTool className="h-8 w-8 text-emerald-500" /> 
            AI Copywriter
          </h1>
          <p className="text-zinc-400">Generate high-converting social media copy, ads, and email sequences in seconds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Form Area */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-zinc-800/50 bg-zinc-950/50 pb-4">
              <CardTitle className="text-lg font-semibold text-white">Campaign Details</CardTitle>
              <CardDescription className="text-zinc-400">Describe your product, service, or goal.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-sm font-medium text-zinc-300">
                    What do you want to promote?
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g. A new line of sustainable sneakers for urban commuters. Tone should be energetic and eco-friendly."
                    className="min-h-[150px] resize-none bg-zinc-950 border-zinc-800 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isGenerating || !prompt.trim()} 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold h-12 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all border-0 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Copy...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Generate Copy
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Output Display Area */}
          <Card className="bg-zinc-950 border-zinc-800 shadow-inner flex flex-col h-full min-h-[400px]">
            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-lg font-semibold text-zinc-300 flex items-center justify-between">
                Generated Asset
                {result && (
                  <span className="text-xs font-normal text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    Ready
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500/50" />
                  <p className="text-sm font-medium animate-pulse">Running AI Models...</p>
                </div>
              ) : result ? (
                <div className="p-6 h-full text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base overflow-y-auto max-h-[400px]">
                  {result}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm text-center p-6">
                  Your generated copy will appear here once the model finishes writing.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
