import { NextResponse } from "next/server";
import { formatLeetCodeData, LEETCODE_QUERY } from "@/lib/leetcode";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    // fetch LeetCode data first
    const leetRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username } }),
    });

    const leetJson = await leetRes.json();
    if (leetJson.errors) {
      return NextResponse.json(
        { error: "Failed to fetch LeetCode data", details: leetJson.errors },
        { status: 500 }
      );
    }
    const stats = formatLeetCodeData(leetJson.data);

    const prompt = `You are a coding mentor AI. Based on the following JSON statistics from a LeetCode user, analyze their performance and create a 30-day study plan.\n\nReturn ONLY a JSON object with the following exact structure:\n{\n  \"analysis\": string,                    // high-level assessment\n  \"plan\": [                               // array of 30 entries (one per day or per week)\n    { \"day\": string, \"tasks\": string }\n  ]\n}\nDo NOT wrap the JSON in markdown fences or any extra text.\n\nUserStats:\n${JSON.stringify(stats)}`;

    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const geminiJson = await geminiRes.json();

    // Extract text part which should be pure JSON
    const contentText =
      geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let structured: any = null;
    try {
      structured = JSON.parse(contentText);
    } catch (e) {
      // fallback – return raw text
      structured = { raw: contentText };
    }

    return NextResponse.json(
      {
        stats,
        report: structured,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Gemini API error", err);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
} 