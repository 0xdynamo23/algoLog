import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LEETCODE_QUERY, formatLeetCodeData } from "@/lib/leetcode";

export const revalidate = 3600; // 1h cache (Next.js route segment option)

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { leetcodeUsername: { not: null } },
      select: { id: true, name: true, email: true, leetcodeUsername: true }
    });

    const results = await Promise.all(users.map(async (u) => {
      try {
        const res = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
          body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username: u.leetcodeUsername } })
        });
        const json = await res.json();
        if (json.errors) throw new Error("err");
        const data = formatLeetCodeData(json.data);
        return { ...u, totalSolved: data.totalSolved, ranking: data.ranking };
      } catch {
        return { ...u, totalSolved: 0, ranking: null };
      }
    }));

    results.sort((a, b) => b.totalSolved - a.totalSolved);
    return NextResponse.json({ leaderboard: results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 