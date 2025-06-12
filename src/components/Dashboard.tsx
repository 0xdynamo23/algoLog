"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Heatmap from "./Heatmap";

interface User {
  id: string;
  email: string;
  name?: string;
  streak: number;
  coins: number;
  completedDates: string[];
  completedProblems: string[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
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
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header with animated gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-600/90"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Welcome back, {user.name || user.email.split('@')[0]}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Keep building your coding momentum and achieve greatness
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 font-medium border border-white/20"
            >
              Logout
            </button>
          </div>
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-lg animate-bounce"></div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Streak Card */}
          <div className="group bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-2 animate-pulse">🔥</span>
                  <span className="text-sm font-medium opacity-90">Current Streak</span>
                </div>
                <p className="text-3xl font-bold">{user.streak}</p>
                <p className="text-sm opacity-75">days in a row</p>
              </div>
            </div>
            <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/60 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Coins Card */}
          <div className="group bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-2 animate-bounce">💰</span>
                  <span className="text-sm font-medium opacity-90">Total Coins</span>
                </div>
                <p className="text-3xl font-bold">{user.coins}</p>
                <p className="text-sm opacity-75">earned so far</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>

          {/* Problems Solved Card */}
          <div className="group bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-2">✅</span>
                  <span className="text-sm font-medium opacity-90">Problems Solved</span>
                </div>
                <p className="text-3xl font-bold">{user.completedProblems.length}</p>
                <p className="text-sm opacity-75">challenges completed</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-white/60 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Achievement Card */}
          <div className="group bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-2">🏆</span>
                  <span className="text-sm font-medium opacity-90">Achievement</span>
                </div>
                <p className="text-lg font-bold">
                  {user.streak >= 7 ? "Week Warrior" : 
                   user.streak >= 3 ? "Streak Master" : 
                   user.completedProblems.length >= 5 ? "Problem Solver" : "Getting Started"}
                </p>
                <p className="text-sm opacity-75">current level</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white/60 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((user.streak / 7) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Heatmap Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Coding Journey 📈
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track your daily progress and build consistent habits
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Active Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.completedDates.length}</p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <Heatmap completedDates={user.completedDates} />
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/solve"
            className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🚀</span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Start Coding</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Browse Problems</h3>
              <p className="text-green-100">Choose from our curated collection of coding challenges</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            href="/store"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🛍️</span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{user.coins} coins</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Visit Store</h3>
              <p className="text-blue-100">Redeem your coins for awesome rewards and customizations</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Motivational Quote Section */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-2xl p-6 border border-indigo-200/20 dark:border-indigo-700/20">
          <div className="text-center">
            <span className="text-2xl mb-2 block">💡</span>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              "The only way to do great work is to love what you do."
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">- Steve Jobs</p>
          </div>
        </div>
      </div>
    </div>
  );
} 