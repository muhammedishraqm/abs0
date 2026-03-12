import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Hero />
      <Pricing />
      {/* Additional sections will be added here */}
    </main>
  );
}
