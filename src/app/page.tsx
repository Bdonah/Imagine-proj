"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/ollama";

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("📁 File selected:", file.name);
    setFileName(file.name);
  

    const reader = new FileReader();

    reader.onload = (event) => {
      
      const content = event.target?.result;
      if (typeof content === "string") {
        setFileContent(content);
        console.log("✅ File loaded successfully:", file.name);
      } else {
        console.error("❌ File content is not a string.");
      }
    };

    try {
      if (file.type === "application/pdf") {
        const formData = new FormData();
        formData.append("file", file);
        console.log("📄 PDF file uploaded, preparing formData for backend:", file.name);
      } else {
        reader.readAsText(file);
        console.log("📝 Non-PDF file uploaded, reading as text:", file.name);
      }
    } catch (error) {
      console.error("❌ Error processing file:", error);
    }
  };

  const clearFile = () => {
    setFileName("");
    setFileContent("");
    console.log("🗑️ File cleared");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center text-center mt-4">
        <button
          className="w-44 h-44 bg-[#D2B48C] text-black text-3xl font-sans rounded-full flex items-center justify-center shadow-md hover:bg-[#C2A178]"
          onClick={() => setCount(count + 1)}
        >
          Click for a cookie🍪
        </button>
        <h1 className="text-4xl mt-4">You have {count} cookies!</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto mt-8 border rounded">
        <h2 className="text-xl font-bold mb-4">Upload a File</h2>
        <input type="file" onChange={handleFileChange} />
        {fileName && (
          <div className="mt-2">
            <p>
              <strong>File Name:</strong> {fileName}
            </p>
            {fileContent && (
              <div>
                <p>
                  <strong>File Content:</strong>
                </p>
                <pre className="bg-gray-100 p-2 rounded max-h-60 overflow-auto">
                  {fileContent}
                </pre>
              </div>
            )}
          </div>
        )}
        <button
          onClick={clearFile}
          className="mt-2 p-2 bg-red-500 text-white rounded flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
          </svg>
          Clear File
        </button>
      </div>

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