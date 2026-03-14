import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // Option to explicitly provide standard API version, e.g., apiVersion: '2023-10-16'
});

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json();

    if (!priceId) {
      return new NextResponse("Price ID is missing", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("User ID is missing", { status: 400 });
    }

    // Set the URL that the user will be redirected to upon successful/canceled payment
    // We try to use the request origin to stay dynamic across local/production
    const url = new URL(req.url);
    const origin = `${url.protocol}//${url.host}`;
    
    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      // Attach the Firebase user UID to client_reference_id
      // This allows the webhook to know exactly which user paid
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
      // Require billing address to be collected for stronger fraud prevention/SaaS compliance
      billing_address_collection: "required",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
