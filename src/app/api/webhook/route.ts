import { NextResponse } from "next/server";
import Stripe from "stripe";
import * as admin from "firebase-admin";

// 1. Initialize Firebase Admin securely (ensure it only initializes once)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must have formatted newlines, we replace the literal \n strings if they exist
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error("Firebase Admin Initialization Error", error);
  }
}

const db = admin.firestore();

// 2. Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  // Stripe requires the raw body to verify the signature
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    // Verify the webhook event wasn't tampered with
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log("✅ Webhook Constructed Signature verified:", event.id);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("Webhook Received:", event.type);

  // Handle the specific event: checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract the UID we passed in during session creation
    const userId = session.metadata?.userId || session.client_reference_id;
    console.log("🔍 Checking extracted User ID:", userId);

    if (userId) {
      try {
        console.log('UPGRADING USER:', userId);
        
        // We can determine tier based on the purchased amount/price ID, but here we'll assume a premium bump
        await db.collection("users").doc(userId).update({
          subscriptionTier: "pro", // Ideally, this maps from session.line_items/price
        });
        console.log(`✅ Successfully upgraded user ${userId} to pro.`);
      } catch (error) {
        console.error(`❌ Error updating user ${userId} in Firestore:`, error);
        // We still Return 200 to Stripe so it stops retrying the webhook, but we log the internal DB failure
        return new NextResponse(`Database Error`, { status: 500 });
      }
    } else {
      console.warn("⚠️ No UID found in session metadata or client_reference_id. Cannot upgrade user.");
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  return new NextResponse("OK", { status: 200 });
}
