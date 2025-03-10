import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VOUCHER_COSTS = {
  "amazon-100": 10000,
  "zomato-100": 10000,
  "swiggy-10": 100,
  "flipkart-10": 100,
};

function generateVoucherCode(provider: string): string {
  // Generate a 16-digit voucher code
  const prefix = provider.startsWith("amazon")
    ? "AMZN"
    : provider.startsWith("zomato")
      ? "ZMTO"
      : provider.startsWith("swiggy")
        ? "SWGY"
        : "FLPK";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const checksum = Math.random().toString(36).substring(2, 4).toUpperCase();

  return `${prefix}-${timestamp}-${random}-${checksum}`;
}

export async function POST(req: Request) {
  try {
    const userId = cookies().get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { voucherId } = await req.json();

    if (!voucherId || !VOUCHER_COSTS[voucherId as keyof typeof VOUCHER_COSTS]) {
      return NextResponse.json(
        { error: "Invalid voucher selected" },
        { status: 400 }
      );
    }

    const pointsCost = VOUCHER_COSTS[voucherId as keyof typeof VOUCHER_COSTS];

    // Get user and check points in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          points: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.points < pointsCost) {
        throw new Error("Insufficient points");
      }

      // Update user points
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          points: user.points - pointsCost,
        },
        select: {
          id: true,
          name: true,
          email: true,
          points: true,
        },
      });

      // Generate voucher code
      const voucherCode = generateVoucherCode(voucherId);

      return {
        user: updatedUser,
        voucherCode,
      };
    });

    return NextResponse.json({
      message: "Points redeemed successfully",
      user: result.user,
      voucherCode: result.voucherCode,
    });
  } catch (error: any) {
    console.error("Points redemption error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to redeem points" },
      { status: error.message === "Insufficient points" ? 400 : 500 }
    );
  }
}
