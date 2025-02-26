import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Ensure the request body is parsed correctly
    const body = await req.json();
    const { prompt } = body;

    // Validate the prompt input
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Fetch response from Ollama
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3", // Replace this with the actual model you're using
        prompt: prompt,
        stream: false, // Ensures we wait for the full response
      }),
    });

    // Parse the response
    if (!res.ok) {
      throw new Error(`Ollama API returned an error: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch response from Ollama" }, { status: 500 });
  }
}