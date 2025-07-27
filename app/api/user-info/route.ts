import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employer: true,
        jobSeeker: true,
      },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const base = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.role === "EMPLOYER") {
      return NextResponse.json({ ...base, ...user.employer });
    } else {
      return NextResponse.json({ ...base, ...user.jobSeeker });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { email, name, companyName, companyWebsite, bio, skills } = body;

  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.user.update({
      where: { email },
      data: { name },
    });

    if (user.role === "EMPLOYER") {
      await prisma.employer.update({
        where: { id: user.id },
        data: { companyName, companyWebsite },
      });
    } else {
      await prisma.jobSeeker.update({
        where: { id: user.id },
        data: { bio, skills },
      });
    }

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
