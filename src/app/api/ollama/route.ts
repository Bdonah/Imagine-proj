import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Extract the prompt from the request body
    const { prompt } = await req.json();

    // Validate the prompt
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    console.log("✅ Received Prompt:", prompt);

    // Send a POST request to the Ollama API
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3", // Replace with your model name
        prompt: prompt,
        stream: false, // Wait for the complete response
      }),
    });

    console.log("✅ Ollama API Response Status:", ollamaResponse.status);

    // Handle errors from the Ollama API
    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("❌ Ollama API Error:", errorText);
      throw new Error(`Ollama API error: ${ollamaResponse.status} ${ollamaResponse.statusText}`);
    }

    // Parse the response from the Ollama API
    const data = await ollamaResponse.json();
    console.log("✅ Ollama API Response Data:", data);

    // Return the response to the frontend
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Failed to fetch response from Ollama" }, { status: 500 });
  }
}