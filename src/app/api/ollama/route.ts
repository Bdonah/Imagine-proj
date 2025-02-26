import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    console.log("✅ Received Prompt:", prompt);

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false,
      }),
    });

    console.log("✅ Ollama API Response Status:", ollamaResponse.status);

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("❌ Ollama API Error:", errorText);
      throw new Error(`Ollama API error: ${ollamaResponse.status} ${ollamaResponse.statusText}`);
    }

    const data = await ollamaResponse.json();
    console.log("✅ Ollama API Response Data:", data);

    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Failed to fetch response from Ollama" }, { status: 500 });
  }
}

// Add this to handle OPTIONS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow all origins (or specify your frontend URL)
      "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow POST and OPTIONS requests
      "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
    },
  });
}