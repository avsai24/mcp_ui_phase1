export type PreviewType = "html" | "markdown" | "js-console" | "python" | "unknown";

export function detectPreviewType(code: string): PreviewType {
  const trimmed = code.trim();

  // HTML detection
  if (
    trimmed.startsWith("<!DOCTYPE html") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("<head") ||
    trimmed.includes("<body")
  ) {
    return "html";
  }

  // JS detection
  if (
    trimmed.startsWith("console.log") ||
    trimmed.includes("console.log(")
  ) {
    return "js-console";
  }

  // Python detection: Match multi-line blocks with `def`, loops, etc.
  const pythonBlockPattern = /(^|\n)(def |import |print\(|for |if |try:|except|input\(|exit\(\))/;
  const pythonLines = code.split("\n").filter((line) =>
    /def |import |print\(|if |for |input\(|except|exit/.test(line)
  );

  if (pythonBlockPattern.test(code) && pythonLines.length >= 3) {
    return "python";
  }

  // Markdown detection
  const markdownIndicators = [
    /^#/, /^##/, /^###/, /\*\*/, /\*/, /_/, /```/
  ];
  if (markdownIndicators.some((regex) => regex.test(trimmed))) {
    return "markdown";
  }

  return "unknown";
}