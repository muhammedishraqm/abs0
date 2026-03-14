"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ToolsPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">AI Tools</h1>
        <p className="text-zinc-400">Manage and deploy your automated AI workflows.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-sm border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-14 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800 mb-6 shadow-inner">
            <PlusCircle className="h-10 w-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No active tools yet</h3>
          <p className="text-zinc-400 max-w-sm mx-auto mb-8 leading-relaxed">
            Your workspace is ready. Click below to begin configuring your first Custom AI Workflow or Integration.
          </p>
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold px-8 h-12 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Configure New Tool
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
