"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) return; // Validate the prompt

    setLoading(true);
    setResponse("");

    try {
      // Send the prompt to the backend
      const res = await fetch("http://localhost:3001/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }), // Pass the user's prompt
      });

      console.log("✅ Backend Response Status:", res.status);

      // Handle errors from the backend
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      // Parse the backend response
      const data = await res.json();
      console.log("✅ Backend Response Data:", data);

      // Update the response state
      setResponse(data.response || "No response from AI");
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setResponse("Error fetching response");
    }

    setLoading(false);
  };

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
          onClick={sendPrompt}
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