"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  HomeIcon, 
  CodeBracketIcon, 
  ShoppingBagIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  FireIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

export default function Navbar() {
  const user = useSelector((state:any)=>state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // user is sourced from redux preloaded state
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Leaderboard", href: "/leaderboard", icon: ChartBarIcon },
    { name: "Store", href: "/store", icon: ShoppingBagIcon },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  if (!user) {
    return (
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CodeBracketIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AlgoLog
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CodeBracketIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AlgoLog
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 px-2 py-1 rounded-full">
              <FireIcon className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">{user.streak}</span>
            </div>
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-2 py-1 rounded-full">
              <CurrencyDollarIcon className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">{user.coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-r border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <CodeBracketIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AlgoLog
              </span>
            </Link>
          </div>

          {/* User Stats */}
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-3 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center space-x-2">
                  <FireIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Streak</p>
                    <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{user.streak}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-3 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Coins</p>
                    <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{user.coins}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-xl border border-green-200/50 dark:border-green-700/50">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Solved</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">{(user.completedProblems?.length ?? user.solved ?? 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative flex flex-col w-80 max-w-xs bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-2xl">
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <Link href="/" className="flex items-center space-x-3" onClick={() => setIsSidebarOpen(false)}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CodeBracketIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AlgoLog
                </span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile User Stats */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-3 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                  <div className="flex items-center space-x-2">
                    <FireIcon className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Streak</p>
                      <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{user.streak}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-3 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50">
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Coins</p>
                      <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{user.coins}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-xl border border-green-200/50 dark:border-green-700/50">
                  <div className="flex items-center space-x-2">
                    <TrophyIcon className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Solved</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">{(user.completedProblems?.length ?? user.solved ?? 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-red-500" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 