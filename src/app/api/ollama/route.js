import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    console.log("Ollama API Response:", data); // ✅ Logs API response in Next.js terminal

    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "⚠️ Failed to fetch response from Ollama" }, { status: 500 });
  }
}