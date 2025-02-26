"use client";

import { useState } from "react";

export default function Home() {
  return (
    <>
      <h1 className="text-2xl text-center">Emagine Educational Project</h1>
      <ClickCounter />
      <OllamaChat />
    </>
  );
}

function ClickCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center text-center mt-4">
      <button
        className="w-44 h-44 bg-[#D2B48C] text-black text-3xl font-sans rounded-full flex items-center justify-center shadow-md hover:bg-[#C2A178]"
        onClick={() => setCount(count + 1)}
      >
        Click for a cookie🍪
      </button>
      <h1 className="text-4xl mt-4">You have {count} cookies!</h1>
    </div>
  );
}

function OllamaChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    setLoading(true);
    setResponse("Generating response...");

    try {
      const res = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      console.log("Frontend Response Status:", res.status); // ✅ Logs the response status

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Frontend Received API Response:", data); // ✅ Logs the API response in browser console

      if (data.response) {
        setResponse(data.response);
      } else {
        setResponse("⚠️ No response received from AI.");
      }
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      setResponse(`⚠️ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl mt-6 text-white">AI Chatbot</h2>
      <textarea
        className="border p-2 w-full h-32 bg-white text-black rounded-md"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your prompt..."
      />
      <button
        onClick={sendPrompt}
        className="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Send"}
      </button>
      <div className="mt-4 p-2 border text-white">
        {response}
      </div>
    </div>
  );
}