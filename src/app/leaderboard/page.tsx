"use client";
import { useEffect, useState } from "react";

const pointsOf = (e:any)=> e.totalSolved; // we'll adjust below when we have diff counts but we only have total solved. you can adapt later.

interface Entry {
  id: string;
  name: string | null;
  email: string;
  leetcodeUsername: string;
  totalSolved: number;
  ranking: number | null;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/leaderboard");
        const json = await res.json();
        setData(json.leaderboard);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maxPts = Math.max(...data.map(pointsOf),1);

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
      {loading ? (
        <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/></div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow border">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">LeetCode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Solved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Global Rank</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((entry, idx) => (
                <tr key={entry.id} className={idx < 3 ? "bg-purple-50 dark:bg-purple-900/20" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.name ?? entry.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.leetcodeUsername}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {entry.totalSolved}
                    <div className="mt-1 h-2 rounded bg-purple-200 dark:bg-purple-800">
                      <div className="h-full rounded bg-purple-600" style={{width:`${(pointsOf(entry)/maxPts)*100}%`}} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.ranking ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 