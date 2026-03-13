import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { BookCallModal } from "@/components/ui/book-call-modal";

const pricingTiers = [
  {
    name: "Starter",
    price: "$2,500",
    description: "Foundational AI integration for growing businesses.",
    features: [
      "Custom AI Chatbot Deployment",
      "Process Bottleneck Analysis",
      "Basic Workflow Automation",
      "Email Support",
    ],
    buttonText: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$7,500",
    description: "Comprehensive ecosystem for serious scaling.",
    features: [
      "End-to-End Operation Mapping",
      "Multi-Agent AI Workflows",
      "CRM & ERP Integration",
      "Priority 24/7 Support",
      "Monthly Efficiency Audits",
    ],
    buttonText: "Accelerate Growth",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Sovereign AI infrastructure for market leaders.",
    features: [
      "Dedicated AI Architect",
      "On-Premise Model Deployment",
      "Unlimited Automation Seats",
      "White-Glove Implementation",
      "Bespoke Security Compliance",
    ],
    buttonText: "Contact Sales",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section className="bg-zinc-950 py-24 px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Investment Structure
          </h2>
          <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Choose Your Tier of Excellence.
          </h3>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Transparent, performance-based pricing architected for maximum ROI 
            in the Dubai and Abu Dhabi markets.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700 ${
                tier.highlight
                  ? "border-zinc-700 ring-1 ring-zinc-700 scale-105 shadow-2xl shadow-zinc-900/50 z-10"
                  : ""
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-950">
                  Recommended
                </div>
              )}
              <CardHeader className="space-y-4">
                <CardTitle className="text-2xl font-bold text-white">
                  {tier.name}
                </CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-sm text-zinc-500">/project</span>
                  )}
                </div>
                <CardDescription className="text-zinc-400">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4 text-sm text-zinc-300">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8">
                <BookCallModal selectedPackage={tier.name}>
                  <Button
                    className={`w-full h-12 text-sm font-semibold transition-all ${
                      tier.highlight
                        ? "bg-white text-zinc-950 hover:bg-zinc-200"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                  >
                    {tier.buttonText}
                  </Button>
                </BookCallModal>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-500">
            Prices are exclusive of 5% VAT. Custom retainers available upon request.
          </p>
        </div>
      </div>
    </section>
  );
}
