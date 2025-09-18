import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function CheckSubscription(employerId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      employerId,
      status: "activated",
      endDate: { gte: new Date() },
    },
    include: {
      plan: true,
    },
  });

  if (!subscription) {
    return { valid: false, reason: "No active subscription" };
  }
  return {
    valid: true,
    plan: subscription.plan.name,
    jobLimit: subscription.plan.limitPerMonth,
    expiresAt: subscription.endDate,
  };
}
