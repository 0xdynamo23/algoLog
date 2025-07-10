import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const { email, leetcodeUsername, coins, themePurchased } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    const data: any = {};
    if (leetcodeUsername !== undefined) data.leetcodeUsername = leetcodeUsername;
    if (coins !== undefined) data.coins = coins;
    if (themePurchased !== undefined) data.themePurchased = themePurchased;

    const user = await prisma.user.update({
      where: { email },
      data,
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (err) {
    console.error("User update error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 