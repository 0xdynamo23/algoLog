"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircleIcon, ClockIcon, FireIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";

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
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 border border-green-200 dark:border-green-700";
      case "Medium":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700";
      case "Hard":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-300 border border-red-200 dark:border-red-700";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600";
    }
  };

  const isCompleted = (problemId: string) => {
    return user?.completedProblems.includes(problemId) || false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedCount = problems.filter(p => isCompleted(p.id)).length;
  const totalCount = problems.length;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Coding Problems 💻
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Choose a problem to solve and maintain your coding streak!
          </p>
          
          {/* Progress Stats */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-4 py-2 rounded-full border border-green-200 dark:border-green-700">
              <CheckCircleIconSolid className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                {completedCount}/{totalCount} Completed
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-700">
              <FireIcon className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                {user.streak} Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid gap-6">
          {problems.map((problem, index) => (
            <div
              key={problem.id}
              className={`group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                isCompleted(problem.id)
                  ? "border-green-200 dark:border-green-700 shadow-lg shadow-green-500/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              }`}
            >
              {/* Completion Badge */}
              {isCompleted(problem.id) && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    <CheckCircleIconSolid className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {problem.title}
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {problem.description.split('\n')[0]}
                  </p>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Link
                    href={`/solve/${problem.id}`}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isCompleted(problem.id)
                        ? "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-blue-500/25"
                    }`}
                  >
                    {isCompleted(problem.id) ? "Review Solution" : "Solve Problem"}
                  </Link>
                  
                  {/* Estimated Time */}
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    <span>
                      {problem.difficulty === "Easy" ? "15-30 min" : 
                       problem.difficulty === "Medium" ? "30-45 min" : "45-60 min"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {problems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No problems available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Check back later for new coding challenges!
            </p>
          </div>
        )}

        {/* Motivational Section */}
        {problems.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/10 dark:via-gray-800 dark:to-purple-900/10 rounded-2xl p-6 lg:p-8 border border-blue-200/50 dark:border-blue-700/50">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                💪 Keep Going!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {completedCount === 0 
                  ? "Start with your first problem and begin building your coding streak!"
                  : completedCount === totalCount
                  ? "Amazing! You've completed all available problems. More challenges coming soon!"
                  : `You've completed ${completedCount} out of ${totalCount} problems. Keep up the great work!`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 