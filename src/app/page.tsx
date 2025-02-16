"use client";
import { useState } from "react";

export default function Home() {
  return (
    <>
    <h1 className="text-2xl"> Emagine Educational Project</h1>
    <ClickCounter />
    
    </>
  );
}

function ClickCounter (){
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center text-center mt-4">
      <button
        className="w-44 h-44  bg-[#D2B48C] text-black text-3xl font-sans rounded-full flex items-center justify-center shadow-md hover:bg-[#C2A178]"
        onClick={() => setCount(count + 1)}
      >
        🍪Click for a cookie🍪 
      </button>
      <h1 className="text-4xl mt-4">You have {count} cookies!</h1>
    </div>
  );
}