import React from "react";
import ChatPanel from "../components/ChatPanel";
import ResponsePanel from "../components/ResponsePanel";

export default function HomePage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Left: Chat Panel */}
      <section className="w-1/2 h-full border-r border-gray-200 overflow-y-auto">
        <ChatPanel />
      </section>

      {/* Right: Response Panel */}
      <section className="w-1/2 h-full overflow-y-auto">
        <ResponsePanel />
      </section>
    </main>
  );
}