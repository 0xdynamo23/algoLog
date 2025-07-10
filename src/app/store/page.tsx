"use client";
import { useEffect, useState } from "react";
import { CurrencyDollarIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function StorePage() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("light");

  // load user and theme
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const u = JSON.parse(userData);
      setUser(u);
      const storedTheme = localStorage.getItem("theme") || "light";
      setTheme(storedTheme);
      if (u.themePurchased) applyTheme(storedTheme);
    }
  }, []);

  const applyTheme = (mode: string) => {
    const html = document.documentElement;
    if (mode === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("theme", mode);
    setTheme(mode);
  };

  const buyTheme = async () => {
    if (!user) return;
    setStatus("purchasing");
    const res = await fetch("/api/store/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setStatus("success");
    } else {
      setStatus(data.error || "error");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Login required.</div>;
  }

  const canPurchase = user.coins >= 20;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Theme Store</h1>

        <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
          <CurrencyDollarIcon className="w-6 h-6" />
          <span className="text-lg font-bold">{user.coins}</span>
        </div>

        {!user.themePurchased ? (
          <>
            <p className="text-gray-700 dark:text-gray-300">Unlock the Light/Dark mode toggle for <strong>20 Coins</strong>.</p>
            <button
              onClick={buyTheme}
              disabled={!canPurchase || status === "purchasing"}
              className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 disabled:opacity-50"
            >
              {status === "purchasing" ? "Processing..." : !canPurchase ? "Not enough coins" : "Buy Theme"}
            </button>
            {status && status !== "purchasing" && status !== "success" && (
              <p className="text-red-500 text-sm mt-2">{status}</p>
            )}
          </>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300">Theme purchased! Choose your preference:</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => applyTheme("light")}
                className={`p-3 rounded-full border ${theme === "light" ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-700"}`}
              >
                <SunIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => applyTheme("dark")}
                className={`p-3 rounded-full border ${theme === "dark" ? "bg-purple-600 text-white" : "bg-white dark:bg-gray-700"}`}
              >
                <MoonIcon className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 