export async function POST() {
    try {
      const res = await fetch("https://data.mongodb-api.com/...", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time: new Date().toISOString() }),
      });
  
      if (!res.ok) {
        throw new Error(`MongoDB API error: ${res.status} ${res.statusText}`);
      }
  
      const data = await res.json();
  
      return NextResponse.json(data);
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
  }