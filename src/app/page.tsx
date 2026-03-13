import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col">
      <Hero />
      <div className="space-y-32 lg:space-y-48 pb-32">
        <Pricing />
        <Contact />
      </div>
    </main>
  );
}
