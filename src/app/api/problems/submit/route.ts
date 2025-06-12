import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId, problemId } = await request.json();

    if (!userId || !problemId) {
      return NextResponse.json(
        { error: "User ID and Problem ID are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if this specific problem is already completed
    if (user.completedProblems.includes(problemId)) {
      return NextResponse.json(
        { error: "You have already completed this problem" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user has completed any problem today
    const hasCompletedToday = user.completedDates.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });

    // Calculate new streak
    let newStreak = user.streak;
    let shouldUpdateStreak = false;

    if (!hasCompletedToday) {
      // This is the first problem completed today
      if (user.lastActiveDate) {
        const lastActive = new Date(user.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActive.getTime() === yesterday.getTime()) {
          // Consecutive day - increment streak
          newStreak = user.streak + 1;
        } else if (lastActive.getTime() < yesterday.getTime()) {
          // Gap in streak - reset to 1
          newStreak = 1;
        }
        // If lastActive is today, keep current streak
      } else {
        // First time solving any problem
        newStreak = 1;
      }
      shouldUpdateStreak = true;
    }

    // Update user data
    const updateData: any = {
      coins: user.coins + 10, // Award 10 coins per problem
      completedProblems: {
        push: problemId
      }
    };

    // Only update streak and dates if this is the first problem today
    if (shouldUpdateStreak) {
      updateData.streak = newStreak;
      updateData.lastActiveDate = new Date();
      updateData.completedDates = {
        push: new Date()
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Problem submitted successfully",
      coinsEarned: 10,
      newStreak: updatedUser.streak,
      isFirstProblemToday: shouldUpdateStreak
    });

  } catch (error) {
    console.error("Submit problem error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 