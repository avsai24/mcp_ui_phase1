"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type CodeContextType = {
  code: string;
  setCode: (value: string) => void;
};

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider = ({ children }: { children: ReactNode }) => {
  const [code, setCode] = useState("// Your generated code will appear here");
  return (
    <CodeContext.Provider value={{ code, setCode }}>
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = (): CodeContextType => {
  const context = useContext(CodeContext);
  if (!context) throw new Error("useCode must be used inside a CodeProvider");
  return context;
};