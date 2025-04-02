"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { detectPreviewType, PreviewType } from "@/lib/detectPreviewType";

export default function PreviewPanel({ code }: { code: string }) {
  const [type, setType] = useState<PreviewType>("unknown");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [jsOutput, setJsOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const previewType = detectPreviewType(code);
    setType(previewType);
    setJsOutput(""); // reset previous output
    setLoading(false); // reset loading state

    if (previewType === "python") {
      setLoading(true);
      fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "python" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setJsOutput("Error: " + data.error);
          } else {
            setJsOutput(data.output || data.error || "No output");
          }
        })
        .catch(() => setJsOutput("Execution failed"))
        .finally(() => setLoading(false));
    }

    if (previewType === "html") {
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = code;
        }
      }, 0);
    }

    if (previewType === "js-console") {
      const captured: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => captured.push(args.join(" "));
      try {
        new Function(code)();
      } catch (e: any) {
        captured.push("Error: " + e.message);
      }
      console.log = originalLog;
      setJsOutput(captured.join("\n"));
    }
  }, [code]);

  if (!code?.trim()) {
    return <div className="text-gray-400 text-sm">Nothing to preview.</div>;
  }

  if (type === "html") {
    return (
      <iframe
        ref={iframeRef}
        className="w-full h-full border rounded bg-white"
        sandbox="allow-scripts allow-same-origin"
        title="HTML Preview"
      />
    );
  }

  if (type === "js-console") {
    return (
      <pre className="bg-black text-green-400 text-sm p-3 rounded h-full overflow-auto">
        {jsOutput || "No console output"}
      </pre>
    );
  }

  if (type === "markdown") {
    return (
      <div className="prose max-w-none prose-sm text-black bg-white p-4 rounded overflow-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{code}</ReactMarkdown>
      </div>
    );
  }

  if (type === "python") {
    return (
      <pre className="bg-gray-900 text-green-400 text-sm p-3 rounded h-full overflow-auto">
        {loading ? "Running Python code..." : jsOutput || "No output"}
      </pre>
    );
  }

  return <div className="text-gray-400 text-sm">No preview available for this code.</div>;
}