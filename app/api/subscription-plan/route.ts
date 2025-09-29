import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const res = await prisma.subscriptionPlan.findMany();
  if (!res || res.length == 0) {
    return Response.json(
      { error: "No subscription plan found" },
      { status: 404 }
    );
  }
  return Response.json(res, { status: 200 });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, price, duration, limitPerMonth, features } = body;

  if (!name || !price || !duration || !limitPerMonth) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const res = await prisma.subscriptionPlan.create({
      data: {
        name,
        price: parseFloat(price),
        duration: parseInt(duration),
        limitPerMonth: parseInt(limitPerMonth),
        features: features || [],
      },
    });
    return Response.json(res, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    return Response.json(
      { error: "Failed to create subscription plan" },
      { status: 500 }
    );
  }
}
