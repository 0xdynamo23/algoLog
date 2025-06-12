import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { userId, completedProblems = [] } = await request.json();

    // Read problems from questions.json
    const questionsPath = path.join(process.cwd(), "questions.json");
    const questionsData = readFileSync(questionsPath, "utf-8");
    const allProblems = JSON.parse(questionsData);

    // Filter out completed problems
    const availableProblems = allProblems.filter(
      (problem: any) => !completedProblems.includes(problem.id)
    );

    if (availableProblems.length === 0) {
      // If all problems are completed, return a random one anyway
      const randomIndex = Math.floor(Math.random() * allProblems.length);
      return NextResponse.json({
        problem: allProblems[randomIndex],
        message: "All problems completed! Here's a random one to practice."
      });
    }

    // Select a random available problem
    const randomIndex = Math.floor(Math.random() * availableProblems.length);
    const selectedProblem = availableProblems[randomIndex];

    return NextResponse.json({
      problem: selectedProblem,
      message: "Random problem loaded successfully"
    });

  } catch (error) {
    console.error("Random problem error:", error);
    return NextResponse.json(
      { error: "Failed to load problem" },
      { status: 500 }
    );
  }
} 