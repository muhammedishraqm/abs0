import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json();

    if (!prompt || !userId) {
      return NextResponse.json(
        { error: "Prompt and userId are required" },
        { status: 400 }
      );
    }

    // Simulate AI Generation Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For now, return a placeholder response since there are no actual LLM keys provided
    const generatedText = `Here is your high-converting copy based on your prompt:\n\n🚀 Introducing the ultimate solution for you!\n\nAre you tired of the same old problems? Look no further. Our innovative approach will revolutionize your experience.\n\n✨ Why choose us?\n- Unmatched quality and performance.\n- Eco-friendly and sustainable.\n- Built for the modern professional.\n\nDon't wait! Click the link below to transform your life today. 👇\n[Link]\n\n#Innovation #Future #Success`;

    return NextResponse.json({ generatedText });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
