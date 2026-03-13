"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

export function Contact() {
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

        <form className="space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 shadow-2xl backdrop-blur-sm lg:p-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-zinc-300">
                Full Name
              </Label>
              <Input
                id="name"
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
              placeholder="Briefly describe the bottlenecks you seek to automate..."
              className="min-h-[150px] border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
            />
          </div>

          <Button className="w-full h-14 bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-all text-base">
            Request Architectural Review
            <Send className="ml-2 h-5 w-5" />
          </Button>
        </form>

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
