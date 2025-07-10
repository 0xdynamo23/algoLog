export const LEETCODE_QUERY = `\n  query getUserProfile($username: String!) {\n    allQuestionsCount {\n      difficulty\n      count\n    }\n    matchedUser(username: $username) {\n      contributions {\n        points\n      }\n      profile {\n        reputation\n        ranking\n      }\n      submissionCalendar\n      submitStats {\n        acSubmissionNum {\n          difficulty\n          count\n          submissions\n        }\n        totalSubmissionNum {\n          difficulty\n          count\n          submissions\n        }\n      }\n    }\n    recentSubmissionList(username: $username) {\n      title\n      titleSlug\n      timestamp\n      statusDisplay\n      lang\n      __typename\n    }\n    matchedUserStats: matchedUser(username: $username) {\n      submitStats: submitStatsGlobal {\n        acSubmissionNum {\n          difficulty\n          count\n          submissions\n          __typename\n        }\n        totalSubmissionNum {\n          difficulty\n          count\n          submissions\n          __typename\n        }\n        __typename\n      }\n    }\n  }\n`;

// Types for clarity (partial)
interface RawLeetCodeData {
  allQuestionsCount: { difficulty: string; count: number }[];
  matchedUser: {
    contributions: { points: number };
    profile: { reputation: number; ranking: number };
    submissionCalendar: string; // JSON string
    submitStats: {
      acSubmissionNum: { difficulty: string; count: number; submissions: number }[];
      totalSubmissionNum: { difficulty: string; count: number; submissions: number }[];
    };
  };
  recentSubmissionList: any[];
}

// Helper to convert LeetCode submissionCalendar into array of date strings, each occurrence representing one solved problem (so heatmap counts length per date)
function convertCalendarToDates(calendarJSON: string): string[] {
  try {
    const calendarObj: Record<string, number> = JSON.parse(calendarJSON);
    const dates: string[] = [];
    for (const [timestamp, count] of Object.entries(calendarObj)) {
      const tsNum = Number(timestamp) * 1000; // convert to ms
      const dateStr = new Date(tsNum).toISOString().split("T")[0];
      for (let i = 0; i < count; i++) {
        dates.push(dateStr);
      }
    }
    return dates;
  } catch {
    return [];
  }
}

export function formatLeetCodeData(data: RawLeetCodeData) {
  const ac = data.matchedUser.submitStats.acSubmissionNum;
  const total = data.matchedUser.submitStats.totalSubmissionNum;
  const questions = data.allQuestionsCount;

  const formatted = {
    totalSolved: ac[0]?.count ?? 0,
    totalSubmissions: total,
    totalQuestions: questions[0]?.count ?? 0,
    easySolved: ac[1]?.count ?? 0,
    totalEasy: questions[1]?.count ?? 0,
    mediumSolved: ac[2]?.count ?? 0,
    totalMedium: questions[2]?.count ?? 0,
    hardSolved: ac[3]?.count ?? 0,
    totalHard: questions[3]?.count ?? 0,
    ranking: data.matchedUser.profile.ranking,
    contributionPoint: data.matchedUser.contributions.points,
    reputation: data.matchedUser.profile.reputation,
    submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar ?? "{}"),
    recentSubmissions: data.recentSubmissionList,
    matchedUserStats: data.matchedUser.submitStats,
    completedDates: convertCalendarToDates(data.matchedUser.submissionCalendar ?? "{}"),
  };

  return formatted;
} 