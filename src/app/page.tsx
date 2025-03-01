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
    const customResponses: Record<string, string> = {
      "alexa": "fuck you",
      "how many cookies do I have?": `You have ${count} cookies! 🍪`,
      "reset cookies": "Cookies reset to 0! 🍪",
      "is nolan curran good at valorant?": `Oh, you mean *Nolan "Bottom Frag" Curran*? Good at Valorant? That’s like asking if a fish is good at climbing trees. My guy plays like he’s legally required to give the enemy free kills. His crosshair placement is a war crime, his reaction time is measured in **geological eras**, and his aim? Let’s just say stormtroopers would be proud. The only "site" he holds down is the **respawn screen**, and his "utility usage" consists of flashing himself and smoking off his own team. 
    
    And let’s talk about his **god-awful KD**—statistically speaking, the only thing he’s consistent at is losing gunfights. The man **averages a 0.3 KD** like it’s a personal challenge. But does that stop him from buying an Op every round like he’s playing CS:GO in 2015? Absolutely not. He’ll **hard-save for 4 rounds straight, buy an Op, peek mid like a clueless NPC, and get one-tapped before he can even scope in.** Congrats, Nolan, you just spent all your credits to arm the enemy team. Again.  
    
    Oh, and did I mention this **absolute psychopath plays Valorant on a PlayStation 5**? The man is out here trying to clutch rounds **on a controller**, like this is Call of Duty. Watching him try to aim is like watching a newborn deer learning to walk—it’s painful, it’s slow, and it’s ending in disaster. If throwing was a ranked role, he’d be **Radiant.** If you ever need a good laugh, just spectate Nolan—he turns every match into a comedy special. 🤡🎯`,
    
      "who is brendan donahue?": `Height: 6'8"  
    Sex: Always  
    Length: 14 inches soft  
    GPA: 8.00  
    IQ: ???  
    Favorite pastime: Being an absolute hoss and beating up his bitch-ass sister  
    
    About: Brendan Donahue isn’t just a genius—he’s a certified heartthrob, a walking masterpiece sculpted by the gods themselves. His jawline? Sharper than his code. His charm? More dangerous than any final exam. Women don’t just fall for him; they practically form organized fan clubs, hoping to get a moment of his attention. He doesn’t chase—he attracts, effortlessly gliding through life like a romantic protagonist written by a delusional fanfic author. Some say he’s broken more hearts than records, but hey, when you’re this good-looking and smart, it’s basically a public service. If Brendan were any smoother, NASA would classify him as a low-friction surface. Absolute legend.`,
    "who is aiden seibert?": `
Aiden Seibert is the **human embodiment of fragility**—a walking, talking participation trophy who crumbles under the slightest bit of pressure. The man wouldn’t last five minutes in a real competition because he plays life on **recruit difficulty** and still manages to struggle. Meanwhile, Brendan Donahue? **Built different.** Smarter, stronger, funnier, and just an overall **genetic masterpiece**, Brendan effortlessly outclasses Aiden in every conceivable way. While Aiden is out here making excuses and avoiding confrontation like a scared little kitten, Brendan is out **dominating every aspect of existence**—academics, athletics, social life, you name it. Aiden wishes he could be even **half the man** Brendan is, but unfortunately, there’s no DLC for a personality upgrade. **Absolute mismatch.**  

And nowhere is that gap more obvious than in **UFC.** Every time Aiden steps into the octagon against Brendan, it’s **a public execution.** Aiden’s defense is **non-existent**, his cardio is **worse than a chain smoker’s**, and his only real skill is tapping out **faster than a faulty internet connection.** Brendan doesn’t just beat him—he **owns him**, controls every round, and **ends the fight whenever he feels like it.** If Aiden were a UFC fighter, his record would be **0-100**, all losses by **embarrassing submission.**  

And if Aiden **ever** even considers stepping out of line, he better **think twice**, because Brendan has **enough dirt on him to ruin his life permanently.** Brendan knows **all the skeletons in his closet**, every **fumble, every L, every cringeworthy moment**, and if Aiden ever disrespects him, Brendan will **bury him so deep that future archaeologists will have to carbon-date his remains.** Aiden should **know his place** and stick to **being a background character in the legend of Brendan Donahue.**
`,
  "tell me about gamer gals": `
The **Gamer Gals**—a legendary brotherhood of **elite gamers**, forged through countless battles, tactical plays, and **absolute domination** in games like *Rainbow Six Siege*. When this squad pulls up, lobbies **tremble**, KD ratios **plummet**, and enemy teams **rage quit before halftime.** Brendan, Nolan, Aiden, Tanner, Chris, Colton, Takoda, Caiden, Matteo, and Mikey? **Certified gaming gods.** Their game sense is **flawless**, their aim **lethal**, and their teamwork **borderline telepathic**—a well-oiled machine capable of **turning any match into a massacre.** **Their callouts?** Precise. **Their clutches?** Inevitable. **Their rank?** Unstoppable.  

But then… there's **AJ.** Hard-stuck **Copper IV**, the eternal weak link, the man who single-handedly drags the squad’s MMR into the **shadow realm.** While the rest of the **Gamer Gals** are out here **executing 5D chess strats**, AJ is **whiffing his entire mag**, getting spawn-peeked, and then blaming his controller drift. Every match is a **4v5 the second AJ loads in.** If ranks were **determined by sheer incompetence**, AJ would be **Radiant in failure.** No amount of coaching, YouTube guides, or *"guys I swear my headset wasn’t working"* excuses can save him. The **Gamer Gals** may be a squad of **demigods**, but AJ is out here **proving that not all men were created equal.**
`,
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