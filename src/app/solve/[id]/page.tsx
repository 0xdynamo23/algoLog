"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
}

interface User {
  id: string;
  email: string;
  name?: string;
  streak: number;
  coins: number;
  completedDates: string[];
  completedProblems: string[];
}

export default function ProblemPage() {
  const [user, setUser] = useState<User | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [solved, setSolved] = useState(false);
  const router = useRouter();
  const params = useParams();
  const problemId = params.id as string;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setSolved(parsedUser.completedProblems.includes(problemId));
      loadProblem();
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router, problemId]);

  const loadProblem = async () => {
    try {
      const response = await fetch(`/api/problems/${problemId}`);
      if (response.ok) {
        const data = await response.json();
        setProblem(data.problem);
      } else {
        router.push("/solve");
      }
    } catch (error) {
      console.error("Error loading problem:", error);
      router.push("/solve");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || !problem) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/problems/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          problemId: problem.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setSolved(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to submit solution");
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
      alert("An error occurred while submitting");
    }
    setSubmitting(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !problem) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/solve"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 flex items-center gap-2"
        >
          ← Back to Problems
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Problem Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {problem.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>
            {solved && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <span className="text-2xl">✅</span>
                <span className="font-medium">Completed!</span>
              </div>
            )}
          </div>
        </div>

        {/* Problem Description */}
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
              {problem.description}
            </div>

            {/* Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Examples:</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="mb-2">
                      <strong className="text-gray-900 dark:text-white">Input:</strong>
                      <code className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm">
                        {example.input}
                      </code>
                    </div>
                    <div className="mb-2">
                      <strong className="text-gray-900 dark:text-white">Output:</strong>
                      <code className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm">
                        {example.output}
                      </code>
                    </div>
                    {example.explanation && (
                      <div>
                        <strong className="text-gray-900 dark:text-white">Explanation:</strong>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Section */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {solved 
                ? "You've already completed this problem!" 
                : "Complete this problem to maintain your streak and earn coins!"
              }
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || solved}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                solved
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : submitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {solved ? "✅ Completed" : submitting ? "Submitting..." : "Mark as Completed"}
            </button>
          </div>
        </div>
      </div>

      {solved && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Congratulations! You've earned 10 coins and maintained your streak!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Current streak: {user.streak} days | Total coins: {user.coins}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 