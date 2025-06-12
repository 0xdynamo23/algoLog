"use client";
import { useMemo } from "react";

interface HeatmapProps {
  completedDates: string[];
}

export default function Heatmap({ completedDates }: HeatmapProps) {
  const { weeks, stats } = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Start from January 1st of current year
    const startDate = new Date(currentYear, 0, 1);
    
    // Find the Sunday before or on January 1st
    const startDay = startDate.getDay();
    const actualStartDate = new Date(startDate);
    actualStartDate.setDate(startDate.getDate() - startDay);
    
    // Create a map of problem counts per date
    const problemCounts = new Map<string, number>();
    completedDates.forEach(dateStr => {
      const date = new Date(dateStr);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      problemCounts.set(key, (problemCounts.get(key) || 0) + 1);
    });
    
    // Generate 53 weeks of data
    const weeks = [];
    const currentDate = new Date(actualStartDate);
    
    for (let week = 0; week < 53; week++) {
      const weekData = [];
      
      for (let day = 0; day < 7; day++) {
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        const count = problemCounts.get(dateKey) || 0;
        const isToday = currentDate.toDateString() === today.toDateString();
        const isCurrentYear = currentDate.getFullYear() === currentYear;
        
        weekData.push({
          date: new Date(currentDate),
          dateKey,
          count,
          isToday,
          isCurrentYear,
          month: currentDate.getMonth(),
          dayOfWeek: currentDate.getDay()
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(weekData);
    }
    
    // Calculate stats
    const totalProblems = completedDates.length;
    const uniqueDates = new Set(completedDates.map(date => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }));
    const activeDays = uniqueDates.size;
    const maxInDay = Math.max(...Array.from(problemCounts.values()), 0);
    
    return {
      weeks,
      stats: {
        totalProblems,
        activeDays,
        maxInDay
      }
    };
  }, [completedDates]);

  const getIntensityLevel = (count: number) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    return 3; // 3+ problems
  };

  const getSquareClass = (count: number, isToday: boolean) => {
    const level = getIntensityLevel(count);
    let baseClass = "w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer ";
    
    if (isToday) {
      baseClass += "ring-2 ring-blue-500 ring-offset-1 ";
    }
    
    switch (level) {
      case 0:
        return baseClass + "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600";
      case 1:
        return baseClass + "bg-green-300 dark:bg-green-800 hover:bg-green-400 dark:hover:bg-green-700 border border-green-400 dark:border-green-700";
      case 2:
        return baseClass + "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500 border border-green-600 dark:border-green-500";
      case 3:
        return baseClass + "bg-green-700 dark:bg-green-400 hover:bg-green-800 dark:hover:bg-green-300 border border-green-800 dark:border-green-300";
      default:
        return baseClass + "bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600";
    }
  };

  const formatTooltip = (day: any) => {
    const date = day.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (day.count === 0) {
      return `No problems solved on ${date}`;
    } else if (day.count === 1) {
      return `1 problem solved on ${date}`;
    } else {
      return `${day.count} problems solved on ${date}`;
    }
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get month positions for labels - fixed horizontal alignment
  const getMonthLabels = () => {
    const labels = [];
    const monthPositions = new Map();
    
    weeks.forEach((week, weekIndex) => {
      week.forEach((day, dayIndex) => {
        if (day.isCurrentYear && !monthPositions.has(day.month)) {
          // Only add if this is the first occurrence of the month
          monthPositions.set(day.month, {
            weekIndex,
            month: day.month,
            label: monthLabels[day.month]
          });
        }
      });
    });
    
    // Convert to array and sort by month
    return Array.from(monthPositions.values()).sort((a, b) => a.month - b.month);
  };

  const monthLabelPositions = getMonthLabels();

  return (
    <div className="w-full">
      {/* Stats */}
      <div className="flex flex-wrap gap-6 mb-6 text-sm">
        <div className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{stats.totalProblems}</span> problems solved
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{stats.activeDays}</span> active days
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{stats.maxInDay}</span> max in a day
        </div>
      </div>

      {/* Heatmap */}
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels - Fixed horizontal layout */}
            <div className="flex mb-3 ml-8">
              <div className="flex gap-1" style={{ width: `${53 * 16}px` }}>
                {weeks.map((week, weekIndex) => {
                  const monthLabel = monthLabelPositions.find(pos => pos.weekIndex === weekIndex);
                  return (
                    <div key={weekIndex} className="w-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {monthLabel ? monthLabel.label : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col justify-between text-xs text-gray-700 dark:text-gray-300 mr-2 pt-1 font-medium">
                {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, index) => (
                  <div key={index} className="h-3 flex items-center justify-end pr-1">
                    {label}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={getSquareClass(day.count, day.isToday)}
                        title={formatTooltip(day)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-6 text-xs text-gray-700 dark:text-gray-300">
              <span className="font-medium">Less</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-300 dark:bg-green-800 border border-green-400 dark:border-green-700 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-500 dark:bg-green-600 border border-green-600 dark:border-green-500 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-700 dark:bg-green-400 border border-green-800 dark:border-green-300 rounded-sm"></div>
              </div>
              <span className="font-medium">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 