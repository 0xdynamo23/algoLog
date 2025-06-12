"use client";
import { useState, useEffect } from "react";
import { 
  FireIcon, 
  CurrencyDollarIcon, 
  TrophyIcon, 
  SparklesIcon,
  StarIcon,
  GiftIcon,
  BoltIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  ChartBarIcon,
  ClockIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import { 
  FireIcon as FireIconSolid,
  StarIcon as StarIconSolid,
  TrophyIcon as TrophyIconSolid
} from "@heroicons/react/24/solid";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: any;
  solidIcon?: any;
  gradient: string;
  borderGradient: string;
  popular?: boolean;
  premium?: boolean;
  discount?: number;
}

const storeItems: StoreItem[] = [
  // Streak Boosters
  {
    id: "streak-freeze",
    name: "Streak Freeze",
    description: "Protect your streak for one day if you miss solving problems",
    price: 50,
    category: "Streak Boosters",
    icon: ShieldCheckIcon,
    gradient: "from-blue-500 to-cyan-500",
    borderGradient: "from-blue-200 to-cyan-200",
    popular: true
  },
  {
    id: "double-streak",
    name: "Double Streak Day",
    description: "Get 2x streak progress for solving problems today",
    price: 75,
    category: "Streak Boosters",
    icon: FireIcon,
    solidIcon: FireIconSolid,
    gradient: "from-orange-500 to-red-500",
    borderGradient: "from-orange-200 to-red-200"
  },
  {
    id: "streak-multiplier",
    name: "Streak Multiplier (7 days)",
    description: "Earn 1.5x streak points for the next 7 days",
    price: 200,
    category: "Streak Boosters",
    icon: BoltIcon,
    gradient: "from-yellow-500 to-orange-500",
    borderGradient: "from-yellow-200 to-orange-200",
    premium: true
  },

  // Coin Boosters
  {
    id: "coin-doubler",
    name: "Coin Doubler",
    description: "Double coins earned from solving problems for 24 hours",
    price: 100,
    category: "Coin Boosters",
    icon: CurrencyDollarIcon,
    gradient: "from-green-500 to-emerald-500",
    borderGradient: "from-green-200 to-emerald-200",
    popular: true
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Triple coins for the next problem you solve",
    price: 80,
    category: "Coin Boosters",
    icon: SparklesIcon,
    gradient: "from-yellow-400 to-amber-500",
    borderGradient: "from-yellow-200 to-amber-200"
  },
  {
    id: "treasure-chest",
    name: "Treasure Chest",
    description: "Instant bonus of 500 coins",
    price: 300,
    category: "Coin Boosters",
    icon: GiftIcon,
    gradient: "from-purple-500 to-pink-500",
    borderGradient: "from-purple-200 to-pink-200",
    discount: 20
  },

  // Themes & Customization
  {
    id: "dark-theme-pro",
    name: "Dark Theme Pro",
    description: "Premium dark theme with custom accent colors",
    price: 150,
    category: "Themes",
    icon: PaintBrushIcon,
    gradient: "from-gray-700 to-gray-900",
    borderGradient: "from-gray-300 to-gray-500",
    premium: true
  },
  {
    id: "neon-theme",
    name: "Neon Glow Theme",
    description: "Futuristic neon theme with glowing effects",
    price: 200,
    category: "Themes",
    icon: SparklesIcon,
    gradient: "from-cyan-400 to-purple-600",
    borderGradient: "from-cyan-200 to-purple-300",
    premium: true
  },
  {
    id: "nature-theme",
    name: "Nature Theme",
    description: "Calming green theme inspired by nature",
    price: 120,
    category: "Themes",
    icon: HeartIcon,
    gradient: "from-green-400 to-teal-500",
    borderGradient: "from-green-200 to-teal-200"
  },

  // Analytics & Insights
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Detailed performance insights and progress tracking",
    price: 250,
    category: "Analytics",
    icon: ChartBarIcon,
    gradient: "from-indigo-500 to-blue-600",
    borderGradient: "from-indigo-200 to-blue-300",
    premium: true
  },
  {
    id: "time-tracker",
    name: "Time Tracker Pro",
    description: "Track time spent on each problem with detailed reports",
    price: 180,
    category: "Analytics",
    icon: ClockIcon,
    gradient: "from-slate-500 to-gray-600",
    borderGradient: "from-slate-200 to-gray-300"
  },

  // Achievements & Badges
  {
    id: "legendary-badge",
    name: "Legendary Coder Badge",
    description: "Exclusive badge showing your dedication to coding",
    price: 500,
    category: "Badges",
    icon: TrophyIcon,
    solidIcon: TrophyIconSolid,
    gradient: "from-yellow-400 to-yellow-600",
    borderGradient: "from-yellow-200 to-yellow-300",
    premium: true
  },
  {
    id: "star-collector",
    name: "Star Collector Badge",
    description: "Show off your problem-solving achievements",
    price: 300,
    category: "Badges",
    icon: StarIcon,
    solidIcon: StarIconSolid,
    gradient: "from-purple-400 to-indigo-500",
    borderGradient: "from-purple-200 to-indigo-200"
  }
];

const categories = ["All", "Streak Boosters", "Coin Boosters", "Themes", "Analytics", "Badges"];

export default function StorePage() {
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [purchaseStatus, setPurchaseStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const filteredItems = selectedCategory === "All" 
    ? storeItems 
    : storeItems.filter(item => item.category === selectedCategory);

  const handlePurchase = async (item: StoreItem) => {
    if (!user || user.coins < item.price) {
      setPurchaseStatus({ ...purchaseStatus, [item.id]: "insufficient" });
      setTimeout(() => {
        setPurchaseStatus({ ...purchaseStatus, [item.id]: "" });
      }, 3000);
      return;
    }

    setPurchaseStatus({ ...purchaseStatus, [item.id]: "purchasing" });

    // Simulate purchase API call
    setTimeout(() => {
      const updatedUser = { ...user, coins: user.coins - item.price };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setPurchaseStatus({ ...purchaseStatus, [item.id]: "success" });
      
      setTimeout(() => {
        setPurchaseStatus({ ...purchaseStatus, [item.id]: "" });
      }, 3000);
    }, 1000);
  };

  const getDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return Math.floor(price * (1 - discount / 100));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to access the store
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AlgoLog Store
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Enhance your coding journey with premium features and boosters
          </p>
          <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-6 py-3 rounded-full border border-yellow-200 dark:border-yellow-700/50">
            <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
            <span className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
              {user.coins} Coins
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Store Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const SolidIcon = item.solidIcon;
            const status = purchaseStatus[item.id];
            const discountedPrice = getDiscountedPrice(item.price, item.discount);
            
            return (
              <div
                key={item.id}
                className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  item.premium 
                    ? `border-gradient-to-r ${item.borderGradient} shadow-lg`
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {/* Premium Badge */}
                {item.premium && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    PREMIUM
                  </div>
                )}

                {/* Popular Badge */}
                {item.popular && !item.premium && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    POPULAR
                  </div>
                )}

                {/* Discount Badge */}
                {item.discount && (
                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    -{item.discount}%
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  {SolidIcon ? (
                    <SolidIcon className="w-8 h-8 text-white" />
                  ) : (
                    <Icon className="w-8 h-8 text-white" />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {item.discount ? (
                      <>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {discountedPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {item.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.price}
                      </span>
                    )}
                    <CurrencyDollarIcon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={status === "purchasing" || user.coins < discountedPrice}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    status === "success"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : status === "insufficient"
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                      : status === "purchasing"
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                      : user.coins < discountedPrice
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : `bg-gradient-to-r ${item.gradient} text-white hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105`
                  }`}
                >
                  {status === "success"
                    ? "✓ Purchased!"
                    : status === "insufficient"
                    ? "Insufficient Coins"
                    : status === "purchasing"
                    ? "Purchasing..."
                    : user.coins < discountedPrice
                    ? "Not Enough Coins"
                    : "Purchase"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBagIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 