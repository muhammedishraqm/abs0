import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize Firebase Admin securely
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle newline characters in the private key from .env
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json();

    if (!prompt || !userId) {
      return NextResponse.json(
        { error: "Prompt and userId are required" },
        { status: 400 }
      );
    }

    // Connect to Firestore
    const db = admin.firestore();
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    // Check Authorization
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 403 }
      );
    }

    const userData = userDoc.data();
    if (!userData || userData.subscriptionTier === "free") {
      return NextResponse.json(
        { error: "Upgrade to Pro to use this tool" },
        { status: 403 }
      );
    }

    // Simulate AI Generation Delay (2 seconds as requested)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock AI Response String
    const generatedText = `This is your premium automated copy...\n\nBased on your prompt: "${prompt}"\n\n🚀 Discover the difference true quality makes.\n✨ Elevate your strategy today.\n\n(This is a placeholder response. Real LLM backend connection pending.)`;

    // Track Usage
    await userRef.update({
      "metrics.totalTasks": admin.firestore.FieldValue.increment(1),
      "metrics.hoursSaved": admin.firestore.FieldValue.increment(0.5),
    });

    return NextResponse.json({ generatedText });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
