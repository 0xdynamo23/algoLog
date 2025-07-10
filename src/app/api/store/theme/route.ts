import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "user not found" }, { status: 404 });

    if (user.themePurchased) return NextResponse.json({ error: "already purchased" }, { status: 400 });

    const cost = 20;
    if (user.coins < cost) return NextResponse.json({ error: "not enough coins" }, { status: 400 });

    const updated = await prisma.user.update({
      where: { email },
      data: { coins: user.coins - cost, themePurchased: true },
    });
    const { password: _, ...userWithoutPassword } = updated;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
} 