"use client";
import { useState, useRef, ReactHTMLElement, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AskResult = {
  summary: string;
  confidence: number;
};
export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AskResult[]>([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      const { summary, confidence } = data as {
        summary: string;
        confidence: number;
      };
      console.log("Data", data);
      setResult((prev) => [...prev, { summary, confidence }]);
      setQuery("");
      inputRef.current?.focus();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Ask AI Anything</h1>
        <form action="" ref={formRef} onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <Input
              type="text"
              className="flex-1 border rounded-lg p-2"
              placeholder="Ask a question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              ref={inputRef}
            />
            <Button
              className="bg-blue-500 text-white rounded-lg px-4 py-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Thinking..." : "Ask"}
            </Button>
          </div>
        </form>
        <Card className="flex-1 mt-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Answers from the AI.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result?.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                No result yet! Ask the AI
              </p>
            ) : (
              result?.map((item, index) => (
                <div className="border rounded-lg p-2" key={index}>
                  <div className="text-sm leading-6">{item.summary}</div>
                  <div className="mt-1 text-sm leading-6">
                    Confidence: {item.confidence}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
