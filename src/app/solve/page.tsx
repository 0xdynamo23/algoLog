"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function SolvePage() {
  const [user, setUser] = useState<User | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadProblems();
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  const loadProblems = async () => {
    try {
      const response = await fetch("/api/problems/all");
      if (response.ok) {
        const data = await response.json();
        setProblems(data.problems);
      }
    } catch (error) {
      console.error("Error loading problems:", error);
    }
    setLoading(false);
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

  const isCompleted = (problemId: string) => {
    return user?.completedProblems.includes(problemId) || false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 flex items-center gap-2"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Coding Problems
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a problem to solve and maintain your coding streak!
        </p>
      </div>

      <div className="grid gap-4">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {problem.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  {isCompleted(problem.id) && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <span className="text-lg">✅</span>
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {problem.description.split('\n')[0]}
                </p>
              </div>
              <div className="ml-6">
                <Link
                  href={`/solve/${problem.id}`}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isCompleted(problem.id)
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isCompleted(problem.id) ? "Review" : "Solve"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {problems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No problems available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new coding challenges!
          </p>
        </div>
      )}
    </div>
  );
} 