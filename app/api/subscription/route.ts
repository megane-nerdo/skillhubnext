import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYER") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { planId } = await request.json();

  // Fetch plan details
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    return new Response(JSON.stringify({ error: "Plan not found" }), {
      status: 404,
    });
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + plan.duration);

  // Create subscription
  const subscription = await prisma.subscription.create({
    data: {
      employerId: session.user.id,
      planId: plan.id,
      startDate,
      endDate,
      status: "activated",
    },
  });

  return Response.json(subscription);
}
