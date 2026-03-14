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

    // Resilient AI Generation Area
    const generateWithResilience = async (userPrompt: string) => {
      // Trying various model identifiers to find any available quota
      const models = [
        "gemini-2.0-flash", 
        "gemini-1.5-flash", 
        "gemini-1.5-pro",
        "gemini-2.0-flash-exp"
      ];
      let lastError;

      for (const modelName of models) {
        try {
          // Retry each model up to 5 times (total 6 attempts per model)
          for (let attempt = 0; attempt < 5; attempt++) {
            try {
              console.log(`AI Attempt: Model=${modelName}, Attempt=${attempt + 1}`);
              const completion = await gemini.chat.completions.create({
                model: modelName,
                messages: [
                  { role: "system", content: SYSTEM_PROMPT },
                  { role: "user", content: userPrompt },
                ],
              });
              return completion.choices[0]?.message?.content || "No content generated.";
            } catch (err: any) {
              lastError = err;
              // If rate limited, wait longer and retry
              if (err.status === 429 && attempt < 4) {
                const backoff = (attempt + 1) * 2000; // 2s, 4s, 6s, 8s...
                await new Promise((r) => setTimeout(r, backoff));
                continue;
              }
              throw err; 
            }
          }
        } catch (modelError: any) {
          console.warn(`Model ${modelName} failed:`, modelError.message);
          // If it's a 404, we just move to next model immediately
          if (modelError.status === 404 || modelError.status === 429) continue; 
          throw modelError;
        }
      }
      throw lastError;
    };

    const generatedText = await generateWithResilience(prompt);

    // Track usage in Firestore
    await userRef.update({
      "metrics.totalTasks": admin.firestore.FieldValue.increment(1),
      "metrics.hoursSaved": admin.firestore.FieldValue.increment(0.5),
    });

    return NextResponse.json({ generatedText });
  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    
    // Handle specific AI model errors (Rate limits, etc.)
    if (error.status) {
      const status = error.status;
      let message = error.message || "AI service error";
      
      if (status === 429) {
        message = "AI model is currently at its free-tier limit. Please try again in a minute.";
      } else if (status === 404) {
        message = "AI model not found. Defaulting to fallback.";
      }

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
