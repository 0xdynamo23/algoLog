"use client";
import { useState, useEffect } from "react";
import { FireIcon, CurrencyDollarIcon, TrophyIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { FireIcon as FireIconSolid, TrophyIcon as TrophyIconSolid } from "@heroicons/react/24/solid";
import Heatmap from "./Heatmap";

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  icon: any;
  gradient: string;
  completed: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completedProblems = user.completedProblems || [];
  const achievements: Achievement[] = [
    {
      id: "first-problem",
      title: "Getting Started",
      description: "Solve your first problem",
      progress: Math.min(completedProblems.length, 1),
      maxProgress: 1,
      icon: CheckCircleIcon,
      gradient: "from-green-400 to-emerald-500",
      completed: completedProblems.length >= 1
    },
    {
      id: "problem-solver",
      title: "Problem Solver",
      description: "Solve 10 problems",
      progress: Math.min(completedProblems.length, 10),
      maxProgress: 10,
      icon: TrophyIcon,
      gradient: "from-blue-400 to-indigo-500",
      completed: completedProblems.length >= 10
    },
    {
      id: "streak-master",
      title: "Streak Master",
      description: "Maintain a 7-day streak",
      progress: Math.min(user.streak, 7),
      maxProgress: 7,
      icon: FireIcon,
      gradient: "from-orange-400 to-red-500",
      completed: user.streak >= 7
    },
    {
      id: "week-warrior",
      title: "Week Warrior",
      description: "Solve 25 problems",
      progress: Math.min(completedProblems.length, 25),
      maxProgress: 25,
      icon: TrophyIconSolid,
      gradient: "from-purple-400 to-pink-500",
      completed: completedProblems.length >= 25
    }
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Ready to continue your coding journey?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Streak Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-orange-900/20 dark:via-gray-800 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <FireIconSolid className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl lg:text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {user.streak}
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    Day Streak
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FireIcon className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600 dark:text-orange-400">
                  Keep it burning! 🔥
                </span>
              </div>
            </div>
          </div>

          {/* Coins Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-yellow-900/20 dark:via-gray-800 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200/50 dark:border-yellow-700/50 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl shadow-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl lg:text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                    {user.coins}
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                    Coins
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                  Spend wisely! 💰
                </span>
              </div>
            </div>
          </div>

          {/* Problems Solved Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900/20 dark:via-gray-800 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl lg:text-3xl font-bold text-green-700 dark:text-green-300">
                    {completedProblems.length}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Solved
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Great progress! ✅
                </span>
              </div>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-800 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <TrophyIconSolid className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl lg:text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {achievements.filter(a => a.completed).length}
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Achievements
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrophyIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  Unlock more! 🏆
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Activity Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your coding activity throughout the year
            </p>
          </div>
          <Heatmap completedDates={user.completedDates || []} />
        </div>

        {/* Achievements Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Achievements
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track your progress and unlock new milestones
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <div
                  key={achievement.id}
                  className={`relative overflow-hidden rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                    achievement.completed
                      ? "bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border-green-200 dark:border-green-700 shadow-lg shadow-green-500/20"
                      : "bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {achievement.completed && (
                    <div className="absolute top-4 right-4">
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${achievement.gradient} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {achievement.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${achievement.gradient} transition-all duration-500`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 