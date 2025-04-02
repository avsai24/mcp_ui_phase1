export type PreviewType = "html" | "markdown" | "js-console" | "python" | "unknown";

export function detectPreviewType(code: string): PreviewType {
  const trimmed = code.trim().toLowerCase();

  if (trimmed.startsWith("<!doctype html") || trimmed.startsWith("<html") || trimmed.includes("<head") || trimmed.includes("<body")) {
    return "html";
  }

  if (trimmed.startsWith("console.log") || trimmed.includes("console.log(")) {
    return "js-console";
  }

  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("##") ||
    trimmed.startsWith("```") ||
    trimmed.includes("* ") ||
    trimmed.includes("_") ||
    trimmed.includes("**")
  ) {
    return "markdown";
  }

  if (
    trimmed.includes("print(") ||
    trimmed.includes("def ") ||
    trimmed.includes("import ") ||
    trimmed.includes("for ")
  ) {
    return "python";
  }

  return "unknown";
} 
