"use client";

import { useCode } from "@/context/CodeContext";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import PreviewPanel from "./PreviewPanel";

export default function ResponsePanel() {
  const [activeView, setActiveView] = useState<"code" | "preview">("code");
  const { code } = useCode();

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Toggle Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveView("code")}
          className={`px-4 py-2 rounded text-sm font-medium border ${
            activeView === "code"
              ? "bg-black text-white"
              : "bg-white text-black border-gray-300"
          }`}
        >
          View Code
        </button>

        <button
          onClick={() => setActiveView("preview")}
          className={`px-4 py-2 rounded text-sm font-medium border ${
            activeView === "preview"
              ? "bg-black text-white"
              : "bg-white text-black border-gray-300"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 border rounded p-2 bg-white">
        {activeView === "code" ? (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        ) : (
          <PreviewPanel code={code} />
        )}
      </div>
    </div>
  );
}