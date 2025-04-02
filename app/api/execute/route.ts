import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || language !== "python") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    return await new Promise((resolve) => {
      const process = spawn("python3", ["-u"], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let output = "";
      let error = "";

      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        error += data.toString();
      });

      process.on("close", () => {
        resolve(
          NextResponse.json({
            output: output.trim(),
            error: error.trim(),
          })
        );
      });

      process.stdin.write(code);
      process.stdin.end();
    });
  } catch (err) {
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}