"use client";

import { useState } from "react";
import Heatmap from "@/components/Heatmap";

interface Stats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  contributionPoint: number;
  reputation: number;
  completedDates: string[];
}

export default function LeetCodePage() {
  const [username, setUsername] = useState<string>("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch(`/api/leetcode/${username}`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!username) return;
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch(`/api/reportcard/${username}`);
      if (!res.ok) throw new Error("Failed to generate report");
      const data = await res.json();
      setReport(JSON.stringify(data.report, null, 2));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">LeetCode Stats Dashboard</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-center">
        <input
          type="text"
          placeholder="Enter your LeetCode username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-md border w-full sm:w-auto"
        />
        <button
          onClick={fetchStats}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
          disabled={!username || loading}
        >
          {loading ? "Loading..." : "Fetch Stats"}
        </button>
        {stats && (
          <button
            onClick={generateReport}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
            disabled={loading}
          >
            Generate Report Card
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {stats && (
        <div className="space-y-8">
          {/* Basic stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border">
              <h2 className="font-semibold mb-2">Total Solved</h2>
              <p className="text-2xl font-bold">{stats.totalSolved}/{stats.totalQuestions}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border">
              <h2 className="font-semibold mb-2">Ranking</h2>
              <p className="text-2xl font-bold">{stats.ranking}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border">
              <h2 className="font-semibold mb-2">Reputation</h2>
              <p className="text-2xl font-bold">{stats.reputation}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border">
              <h2 className="font-semibold mb-2">Contribution Points</h2>
              <p className="text-2xl font-bold">{stats.contributionPoint}</p>
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700 text-center">
              <h3 className="font-semibold">Easy</h3>
              <p className="text-lg font-bold">{stats.easySolved}/{stats.totalEasy}</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700 text-center">
              <h3 className="font-semibold">Medium</h3>
              <p className="text-lg font-bold">{stats.mediumSolved}/{stats.totalMedium}</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700 text-center">
              <h3 className="font-semibold">Hard</h3>
              <p className="text-lg font-bold">{stats.hardSolved}/{stats.totalHard}</p>
            </div>
          </div>

          {/* Heatmap */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border shadow">
            <h2 className="text-xl font-semibold mb-4">Yearly Activity</h2>
            <Heatmap completedDates={stats.completedDates} />
          </div>
        </div>
      )}

      {report && (
        <div className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow border">
          <h2 className="text-2xl font-bold mb-4">Your 30-Day Improvement Plan</h2>
          <pre className="whitespace-pre-wrap text-sm">{report}</pre>
        </div>
      )}
    </div>
  );
} 