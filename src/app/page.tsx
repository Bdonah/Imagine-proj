"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0); // State for cookie counter

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/ollama";

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    // 🔹 Custom responses for specific prompts
    const customResponses: { [key: string]: string } = {
      "alexa": "fuck you",
      "how many cookies do I have?": `You have ${count} cookies! 🍪`,
      "reset cookies": "Cookies reset to 0! 🍪",
      "who is brendan donahue?": `Height: 6'8" 
Sex: Always 
Length: 14 inches soft 
GPA: 8.00 
IQ: ???
Favorite pastime: Being an absolute hoss and beating up his bitch-ass sister

About: Brendan Donahue isn’t just a genius—he’s a certified heartthrob, a walking masterpiece sculpted by the gods themselves. His jawline? Sharper than his code. His charm? More dangerous than any final exam. Women don’t just fall for him; they practically form organized fan clubs, hoping to get a moment of his attention. He doesn’t chase—he attracts, effortlessly gliding through life like a romantic protagonist written by a delusional fanfic author. Some say he’s broken more hearts than records, but hey, when you’re this good-looking and smart, it’s basically a public service. If Brendan were any smoother, NASA would classify him as a low-friction surface. Absolute legend.`,
    };

    if (customResponses[prompt.toLowerCase()]) {
      if (prompt.toLowerCase() === "reset cookies") {
        setCount(0); // Reset cookie count
      }
      setResponse(customResponses[prompt.toLowerCase()]);
      setLoading(false);
      return;
    }

    try {
      console.log("✅ Sending Prompt to Backend:", prompt);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      console.log("✅ Backend Response Status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Backend Error:", errorText);
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("✅ Backend Response Data:", data);

      setResponse(data.response || "No response from AI");
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setResponse("Error fetching response");
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Cookie Clicker Section */}
      <div className="flex flex-col items-center text-center mt-4">
        <button
          className="w-44 h-44 bg-[#D2B48C] text-black text-3xl font-sans rounded-full flex items-center justify-center shadow-md hover:bg-[#C2A178]"
          onClick={() => setCount(count + 1)}
        >
          Click for a cookie🍪
        </button>
        <h1 className="text-4xl mt-4">You have {count} cookies!</h1>
      </div>

      {/* Chatbot Section */}
      <div className="p-4 max-w-lg mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Chatbot</h1>
        <textarea
          className="w-full p-2 border rounded bg-white text-black placeholder-gray-600"
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