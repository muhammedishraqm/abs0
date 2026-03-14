import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import OpenAI from "openai";

// Initialize Firebase Admin securely
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

// Initialize Gemini client via OpenAI-compatible SDK
const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const SYSTEM_PROMPT = `You are a world-class, high-converting copywriter for a premium Dubai marketing agency. Write professional, engaging, and outcome-driven copy based on the user's request. Keep it concise, use formatting, and do not use generic buzzwords.`;

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json();

    if (!prompt || !userId) {
      return NextResponse.json(
        { error: "Prompt and userId are required" },
        { status: 400 }
      );
    }

    // Connect to Firestore & verify user
    const db = admin.firestore();
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    const userData = userDoc.data();
    if (!userData || userData.subscriptionTier === "free") {
      return NextResponse.json(
        { error: "Upgrade to Pro to use this tool" },
        { status: 403 }
      );
    }

    // Call Gemini via OpenAI-compatible endpoint
    const completion = await gemini.chat.completions.create({
      model: "gemini-1.5-flash", // Switching to 1.5 to handle free tier limits better
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    const generatedText =
      completion.choices[0]?.message?.content || "No content generated.";

    // Track usage in Firestore
    await userRef.update({
      "metrics.totalTasks": admin.firestore.FieldValue.increment(1),
      "metrics.hoursSaved": admin.firestore.FieldValue.increment(0.5),
    });

    return NextResponse.json({ generatedText });
  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    
    // Handle specific AI model rate limits
    if (error.status === 429) {
      return NextResponse.json(
        { error: "AI model is currently at its free-tier limit. Please try again in a minute." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
