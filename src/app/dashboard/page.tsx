"use client";

import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Activity, 
  Clock, 
  Bot, 
  Zap,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useUserData } from "@/hooks/useUserData";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverview() {
  const { userData, loading } = useUserData();

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64 bg-zinc-800" />
          <Skeleton className="h-4 w-96 bg-zinc-800" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl bg-zinc-800" />
          ))}
        </div>
        <Skeleton className="h-[450px] w-full rounded-xl bg-zinc-800" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p className="text-zinc-400">Unable to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  const metrics = userData.metrics || {
    totalTasks: 0,
    hoursSaved: 0,
    activeWorkflows: 0,
    chartData: []
  };
  const isPro = userData?.subscriptionTier === "pro";

  return (
    <div className="relative min-h-screen">
      {/* Soft Paywall Overlay for Free Users */}
      {!isPro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/20 backdrop-blur-[2px]">
          <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 shadow-[0_0_50px_rgba(16,185,129,0.15)] border-t-emerald-500/50">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Unlock Premium Analytics</CardTitle>
              <p className="text-zinc-400 text-sm">
                Get real-time insights into your AI automation performance, hours saved, and system health metrics.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/50 text-center">
                  <div className="text-xs text-zinc-500 mb-1">ROI Tracking</div>
                  <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/50 text-center">
                  <div className="text-xs text-zinc-500 mb-1">Live Webhooks</div>
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

      <div className={`p-8 space-y-8 max-w-7xl mx-auto transition-all duration-700 ${!isPro ? 'blur-md pointer-events-none select-none grayscale-[0.5]' : ''}`}>
        
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">System Overview</h1>
          <p className="text-zinc-400">
            Command center for your enterprise AI automation ecosystems.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Tasks Automated
              </CardTitle>
              <Zap className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.totalTasks.toLocaleString()}</div>
              <p className="text-xs text-emerald-500 mt-1 font-medium">
                Live updates active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Hours Saved
              </CardTitle>
              <Clock className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.hoursSaved.toLocaleString()}</div>
              <p className="text-xs text-emerald-500 mt-1 font-medium">
                Cumulative saving
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Active Workflows
              </CardTitle>
              <Bot className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.activeWorkflows.toLocaleString()}</div>
              <p className="text-xs text-zinc-500 mt-1">
                Currently executing
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-zinc-400">
                System Health
              </CardTitle>
              <Activity className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-emerald-400">100%</div>
              <p className="text-xs text-emerald-500/70 mt-1">
                All systems operational
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Main Chart Area */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Tasks Automated (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metrics.chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#71717a" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderRadius: '8px',
                      border: '1px solid #27272a',
                      color: '#fff',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTasks)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
