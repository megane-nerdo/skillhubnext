import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  let user;

  if (userId) {
    // Fetch another user's profile
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        jobSeeker: true,
        employer: true,
      },
    });
  } else {
    // Fetch current user's profile
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        jobSeeker: true,
        employer: true,
      },
    });
  }

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    role: user.role,
    name: user.name,
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
  console.log(body);

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.role === "EMPLOYER") {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name || "",
        employer: {
          update: {
            companyName: body.companyName || "",
            companyWebsite: body.companyWebsite || "",
            companyAddress: body.companyAddress || "",
            companyBio: body.companyBio || "",
            size: body.size || "",
            phoneNumber: body.phoneNumber || "",
            profilePicUrl: body.profilePicUrl || "",
          },
        },
      },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name || "",
        jobSeeker: {
          update: {
            skills: body.skills || "",
            bio: body.bio || "",
            resumeUrl: body.resumeUrl || "",
            profilePicUrl: body.profilePicUrl || "",
          },
        },
      },
    });
  }

  return NextResponse.json({ success: true });
}
