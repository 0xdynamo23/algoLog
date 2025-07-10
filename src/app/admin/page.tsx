"use client";
import { useEffect, useState } from "react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      fetch('/api/leaderboard').then(r=>r.json()).then(j=>{setLeaderboard(j.leaderboard); setLoading(false);});
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="flex justify-center min-h-screen items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  if (user?.email !== ADMIN_EMAIL) return <div className="min-h-screen flex items-center justify-center"><p>You are not authorized to view this page.</p></div>;

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>
      <h2 className="text-xl font-semibold mb-4">Users Leaderboard</h2>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow border">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">LeetCode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Solved</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboard.map((u:any)=>(
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap">{u.name ?? u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.leetcodeUsername}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.totalSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 