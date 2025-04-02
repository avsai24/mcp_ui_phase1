"use client";

import { useCode } from "@/context/CodeContext";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const { setCode } = useCode();

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const responseText = data.text;

      const aiMessage = { sender: "ai", text: responseText };
      setMessages((prev) => [...prev, aiMessage]);

      const codeMatch = responseText.match(/```[a-z]*\n([\s\S]*?)```/);
      if (codeMatch) {
        setCode(codeMatch[1].trim());
      }
    } catch (err) {
      console.error("Failed to fetch from Gemini:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-500"> AVS.ai</h2>

      {/* Scrollable chat container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-md text-sm break-words shadow-sm ${
                msg.sender === "user"
                  ? "bg-black text-white max-w-[60%]"
                  : "bg-[#f8f9fa] text-black w-full border border-gray-100"
              }`}
            >
              <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <pre className="overflow-x-auto bg-gray-100 rounded p-2 text-left text-xs">
                      <code {...props} />
                    </pre>
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    return inline ? (
                      <code className="bg-gray-200 px-1 rounded text-xs" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400">Thinking...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) handleSend();
          }}
          disabled={loading}
          readOnly={loading}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
          placeholder={loading ? "Waiting for model..." : "Type a message..."}
        />
        <button
          onClick={handleSend}
          className="bg-black text-white px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}