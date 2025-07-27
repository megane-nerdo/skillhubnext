import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      jobSeeker: true,
      employer: true,
    },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    role: user.role,
    ...(user.role === "EMPLOYER" ? user.employer : user.jobSeeker),
  });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const body = await req.json();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.role === "EMPLOYER") {
    await prisma.employer.update({
      where: { id: user.id },
      data: {
        companyName: body.companyName || "",
        companyWebsite: body.companyWebsite || "",
        companyAddress: body.companyAddress || "",
        companyBio: body.companyBio || "",
      },
    });
  } else {
    await prisma.jobSeeker.update({
      where: { id: user.id },
      data: {
        skills: body.skills || "",
        bio: body.bio || "",
        resumeUrl: body.resumeUrl || "",
      },
    });
  }

  return NextResponse.json({ success: true });
}
