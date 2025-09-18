import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
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
  const body = await request.json();
  const { name, price, duration, limitPerMonth, features, subscriptions } =
    body;
  try {
    const res = await prisma.subscriptionPlan.create({
      data: {
        name,
        price,
        duration,
        limitPerMonth,
        features,
      },
    });
    return Response.json(res, { status: 201 });
  } catch (error) {
    return Response.json(error);
  }
}
