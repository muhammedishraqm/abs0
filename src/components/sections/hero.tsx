import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { BookCallModal } from "@/components/ui/book-call-modal";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 text-center">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] left-[10%] h-[400px] w-[500px] rounded-full bg-zinc-800/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] right-[10%] h-[400px] w-[500px] rounded-full bg-zinc-800/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl space-y-10">
        <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-zinc-400 backdrop-blur-md">
          <Sparkles className="mr-2 h-3.5 w-3.5 text-zinc-100" />
          <span>Enterprise AI Solutions · UAE Market Leaders</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-8xl">
            Automate Your Operations. <br />
            <span className="bg-gradient-to-b from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Scale Without Overhead.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            We architect bespoke AI ecosystems for elite UAE enterprises. 
            Stop managing manual bottlenecks—unlock exponential efficiency with 
            sovereign, outcome-driven automation.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
          <BookCallModal>
            <Button 
              size="lg" 
              className="h-14 bg-white px-10 text-base font-semibold text-zinc-950 transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Book a Strategy Call
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </BookCallModal>
          <Link href="/dashboard" passHref>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 border-zinc-800 bg-transparent px-10 text-base font-medium text-zinc-200 backdrop-blur-sm transition-all hover:bg-zinc-900/50 hover:text-white"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="pt-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Trusted by innovators across
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-8 text-xs font-semibold text-zinc-500 opacity-50 grayscale sm:gap-12">
            <span>DUBAI</span>
            <span>ABU DHABI</span>
            <span>SHARJAH</span>
            <span>RIYADH</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
    </section>
  );
}
