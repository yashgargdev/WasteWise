import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a new PrismaClient instance
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, points, wasteType } = await request.json();

    if (!userId || !points || !wasteType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First, check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create waste history record
    const wasteHistory = await prisma.wasteHistory.create({
      data: {
        type: wasteType,
        points: points,
        userId: userId,
      },
    });

    // Update user points
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
      },
    });

    return NextResponse.json({
      message: "Points added successfully",
      user: updatedUser,
      wasteHistory: wasteHistory,
    });
  } catch (error) {
    console.error("Error processing waste:", error);
    return NextResponse.json(
      { error: "Failed to process waste" },
      { status: 500 }
    );
  }
}
