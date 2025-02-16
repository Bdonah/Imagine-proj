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
    <div className="text-center mt-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setCount(count + 1)}
      >
        Clicked {count} times
      </button>
    </div>
  );
}