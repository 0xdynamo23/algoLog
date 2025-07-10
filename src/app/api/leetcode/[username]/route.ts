import { NextResponse } from "next/server";
import { LEETCODE_QUERY, formatLeetCodeData } from "@/lib/leetcode";

// Simple per-instance memory cache (auto resets on redeploy)
const globalForLc = globalThis as unknown as {
  leetCache?: Map<string, { data: any; timestamp: number }>;
};

if (!globalForLc.leetCache) {
  globalForLc.leetCache = new Map();
}

const TEN_MIN = 1000 * 60 * 10;

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  if (!username) {
    return NextResponse.json(
      { error: "Username parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Check cache first
    const cached = globalForLc.leetCache!.get(username);
    if (cached && Date.now() - cached.timestamp < TEN_MIN) {
      return NextResponse.json(cached.data, { status: 200 });
    }

    const graphqlRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username } }),
    });

    const result = await graphqlRes.json();

    if (result.errors) {
      return NextResponse.json(result.errors, { status: 500 });
    }

    const formatted = formatLeetCodeData(result.data);

    // store in cache
    globalForLc.leetCache!.set(username, { data: formatted, timestamp: Date.now() });

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("LeetCode API error", err);
    return NextResponse.json(
      { error: "Failed to fetch data from LeetCode" },
      { status: 500 }
    );
  }
} 