import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { params } = await context;
  const planId = params.id;
  const body = await request.json();
  const { name, price, duration, limitPerMonth, features } = body;

  if (!name || !price || !duration || !limitPerMonth) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // Check if plan exists
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      return Response.json(
        { error: "Subscription plan not found" },
        { status: 404 }
      );
    }

    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id: planId },
      data: {
        name,
        price: parseFloat(price),
        duration: parseInt(duration),
        limitPerMonth: parseInt(limitPerMonth),
        features: features || [],
      },
    });

    return Response.json(updatedPlan, { status: 200 });
  } catch (error) {
    console.error("Error updating subscription plan:", error);
    return Response.json(
      { error: "Failed to update subscription plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { params } = await context;
  const planId = params.id;

  try {
    // Check if plan exists
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      include: {
        subscriptions: true,
      },
    });

    if (!existingPlan) {
      return Response.json(
        { error: "Subscription plan not found" },
        { status: 404 }
      );
    }

    // Check if plan has active subscriptions
    if (existingPlan.subscriptions.length > 0) {
      return Response.json(
        { error: "Cannot delete plan with active subscriptions" },
        { status: 400 }
      );
    }

    await prisma.subscriptionPlan.delete({
      where: { id: planId },
    });

    return Response.json(
      { message: "Subscription plan deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    return Response.json(
      { error: "Failed to delete subscription plan" },
      { status: 500 }
    );
  }
}
