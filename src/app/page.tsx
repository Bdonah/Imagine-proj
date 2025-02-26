"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!prompt) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Error fetching response");
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Chatbot</h1>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Ask me something..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
        <div className="mt-4 p-2 border rounded">
          <strong>Response:</strong> {response || "No response yet."}
        </div>
      </div>
    </main>
  );
}
