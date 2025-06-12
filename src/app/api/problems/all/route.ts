import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function GET() {
  try {
    // Read problems from questions.json
    const questionsPath = path.join(process.cwd(), "questions.json");
    const questionsData = readFileSync(questionsPath, "utf-8");
    const problems = JSON.parse(questionsData);

    return NextResponse.json({
      problems,
      message: "Problems loaded successfully"
    });

  } catch (error) {
    console.error("Load problems error:", error);
    return NextResponse.json(
      { error: "Failed to load problems" },
      { status: 500 }
    );
  }
} 