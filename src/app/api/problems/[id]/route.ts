import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await params;

    // Read problems from questions.json
    const questionsPath = path.join(process.cwd(), "questions.json");
    const questionsData = readFileSync(questionsPath, "utf-8");
    const problems = JSON.parse(questionsData);

    // Find the specific problem
    const problem = problems.find((p: any) => p.id === problemId);

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      problem,
      message: "Problem loaded successfully"
    });

  } catch (error) {
    console.error("Load problem error:", error);
    return NextResponse.json(
      { error: "Failed to load problem" },
      { status: 500 }
    );
  }
} 