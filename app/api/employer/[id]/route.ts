import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
const prisma = new PrismaClient();
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const res = await prisma.employer.findUnique({
    where: { id },
    include: {
      user: true,
      subscriptions: {
        include: {
          plan: true,
        },
      },
    },
  });
  if (!res) {
    return Response.json({ error: "Employer not found" }, { status: 404 });
  }
  return Response.json(res);
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const updatedEmployer = await prisma.employer.update({
      where: { id: params.id },
      data: {
        companyName: data.companyName,
        companyWebsite: data.companyWebsite,
        companyAddress: data.companyAddress,
        verifiedStatus: data.verifiedStatus,

        user: {
          update: {
            name: data.user?.name,
          },
        },
      },
    });
    return Response.json(updatedEmployer);
  } catch (err) {
    console.error("Failed to update employer:", err);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}
