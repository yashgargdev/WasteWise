import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, points } = await req.json();

    if (!userId || typeof points !== "number") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Update user points in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const currentPoints = user.points || 0;

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          points: currentPoints + points,
        },
      });

      return updatedUser;
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result;

    return NextResponse.json({
      message: "Points added successfully",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Add points error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add points" },
      { status: 500 }
    );
  }
}
