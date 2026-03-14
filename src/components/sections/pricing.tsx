"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { BookCallModal } from "@/components/ui/book-call-modal";
import { useUserData } from "@/hooks/useUserData";

const pricingTiers = [
  {
    name: "Starter",
    price: "$2,500",
    priceId: "price_1TAiFfLkI9aMH1NpfKMBuPgf",
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
    priceId: "price_1TAiFgLkI9aMH1NpEPQi3lLx",
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
    priceId: null,
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
  const router = useRouter();
  const { user } = useUserData();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleCheckout = async (tierName: string, priceId: string | null) => {
    if (!user) {
      router.push("/login"); // Require login before payment
      return;
    }

    if (!priceId) return;

    setCheckoutLoading(tierName);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
        }),
      });

      const text = await response.text();
      if (!response.ok) {
        alert(`Checkout Failed: ${text}\n\n(Did you replace the 'price_mock_...' IDs with real Stripe Price IDs in pricing.tsx?)`);
        throw new Error(text);
      }

      const data = JSON.parse(text);
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No URL returned from checkout");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      // We will also alert them here if it was a network error
      if (error.message === "Failed to fetch") {
        alert("Network error: Could not reach the checkout API.");
      }
    } finally {
      setCheckoutLoading(null);
    }
  };

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
                {tier.price === "Custom" ? (
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
                ) : (
                  <Button
                    onClick={() => handleCheckout(tier.name, tier.priceId)}
                    disabled={checkoutLoading === tier.name}
                    className={`w-full h-12 text-sm font-semibold transition-all ${
                      tier.highlight
                        ? "bg-white text-zinc-950 hover:bg-zinc-200"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                  >
                    {checkoutLoading === tier.name ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {checkoutLoading === tier.name ? "Loading..." : tier.buttonText}
                  </Button>
                )}
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
