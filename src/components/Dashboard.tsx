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

interface DashboardProps { userData: any; }

export default function Dashboard({ userData }: DashboardProps) {
  const [user, setUser] = useState<any>(userData);

  // LeetCode integration states
  const [lcUsername, setLcUsername] = useState<string>("");
  const [lcStats, setLcStats] = useState<any>(null);
  const [lcLoading, setLcLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [lcError, setLcError] = useState<string | null>(null);
  const [lcReport, setLcReport] = useState<any>(null);

  // When user prop changes (e.g., after save username), sync state
  useEffect(() => {
    setUser(userData);
  }, [userData]);

  // On user load, prefill stats
  useEffect(() => {
    if (user && user.leetcodeUsername) {
      setLcUsername(user.leetcodeUsername);
      fetchLcStats(user.leetcodeUsername);
    }
  }, [user]);

  const fetchLcStats = async (uname: string) => {
    setLcLoading(true);
    setLcError(null);
    try {
      const res = await fetch(`/api/leetcode/${uname}`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setLcStats(data);
      // update solved count and localStorage
      const updatedUser = { ...user, solved: data.totalSolved };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      // sync coins if needed
      const points = calcPoints(data);
      if (user && user.coins !== points) {
        await fetch('/api/user', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, coins: points })
        });
        setUser({ ...user, coins: points });
      }
    } catch (e: any) {
      setLcError(e.message);
    } finally {
      setLcLoading(false);
    }
  };

  const saveLcUsername = async () => {
    if (!lcUsername) return;
    setLcLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, leetcodeUsername: lcUsername })
      });
      if (!res.ok) throw new Error('Failed to save');
      const updated = await res.json();
      setUser(updated.user);
      fetchLcStats(lcUsername);
    } catch (e: any) {
      setLcError(e.message);
    } finally {
      setLcLoading(false);
    }
  };

  const generateLcReport = async () => {
    setReportLoading(true);
    setLcReport(null);
    try {
      const res = await fetch(`/api/reportcard/${lcUsername}`);
      if (!res.ok) throw new Error("Failed to generate report");
      const data = await res.json();
      let rpt = data.report;
      if (typeof rpt === 'string') {
        try {
          rpt = JSON.parse(rpt);
        } catch {}
      }
      setLcReport(rpt);
    } catch (e: any) {
      setLcError(e.message);
    } finally {
      setReportLoading(false);
    }
  };

  const calcPoints = (stats:any)=> stats.easySolved + 2*stats.mediumSolved + 3*stats.hardSolved;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // NOTE: prebuilt achievements section removed for now per request

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

        {/* LeetCode Username input & stats */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">LeetCode Integration</h2>

          {/* username prompt if not set */}
          {!user.leetcodeUsername && (
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                placeholder="Enter your LeetCode username"
                value={lcUsername}
                onChange={(e) => setLcUsername(e.target.value)}
                className="px-4 py-2 rounded-md border w-full sm:w-auto"
              />
              <button
                onClick={saveLcUsername}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                disabled={!lcUsername || lcLoading}
              >
                {lcLoading ? 'Saving...' : 'Connect'}
              </button>
            </div>
          )}

          {user.leetcodeUsername && (
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <p className="text-sm font-medium">Connected as <strong>{user.leetcodeUsername}</strong></p>
              <button
                onClick={generateLcReport}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                disabled={reportLoading || lcLoading || !lcStats}
              >
                {reportLoading ? 'Generating...' : 'Generate Report Card'}
              </button>
            </div>
          )}

          {lcError && <p className="text-red-500 text-center">{lcError}</p>}

          {lcStats && (
            <div className="space-y-8 w-full">
              {/* Key metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 shadow">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Solved</h3>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{lcStats.totalSolved}/{lcStats.totalQuestions}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 shadow">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ranking</h3>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{lcStats.ranking}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700 shadow">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reputation</h3>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{lcStats.reputation}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700 shadow">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AlgoLog Points</h3>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{calcPoints(lcStats)}</p>
                </div>
              </div>

              {/* Difficulty breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center border border-green-300 dark:border-green-600">
                  <h4 className="font-medium text-green-700 dark:text-green-400">Easy</h4>
                  <p className="font-bold text-lg">{lcStats.easySolved}/{lcStats.totalEasy}</p>
                </div>
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-center border border-yellow-300 dark:border-yellow-600">
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Medium</h4>
                  <p className="font-bold text-lg">{lcStats.mediumSolved}/{lcStats.totalMedium}</p>
                </div>
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg text-center border border-red-300 dark:border-red-600">
                  <h4 className="font-medium text-red-700 dark:text-red-400">Hard</h4>
                  <p className="font-bold text-lg">{lcStats.hardSolved}/{lcStats.totalHard}</p>
                </div>
              </div>

              {/* Heatmap */}
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border shadow">
                <h3 className="text-lg font-semibold mb-4">Yearly Activity</h3>
                <Heatmap completedDates={lcStats.completedDates} />
              </div>
            </div>
          )}

          {lcReport && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow space-y-4">
              <h3 className="text-xl font-bold">Report Card</h3>
              {lcReport.analysis && (
                <div>
                  <h4 className="font-semibold mb-2">Analysis</h4>
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">{lcReport.analysis}</p>
                </div>
              )}
              {Array.isArray(lcReport.plan) && (
                <div>
                  <h4 className="font-semibold mb-4">30-Day Plan</h4>
                  <div className="relative border-l-4 border-purple-600/20 pl-6 space-y-6">
                    {lcReport.plan.map((step:any, idx:number)=>(
                      <div key={idx} className="group relative">
                        <span className="absolute -left-[26px] top-0 w-5 h-5 rounded-full bg-purple-600 group-hover:scale-110 transition-transform" />
                        <h5 className="font-medium text-purple-700 dark:text-purple-300 mb-1">{step.day}</h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{step.tasks}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {lcReport.raw && (
                <pre className="whitespace-pre-wrap text-sm">{lcReport.raw}</pre>
              )}
            </div>
          )}
        </div>

        {/* Removed pre-built blank achievement/chart sections */}
      </div>
    </div>
  );
} 