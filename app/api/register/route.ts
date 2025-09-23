// app/api/register/route.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("jjj");
  const data = await req.json();
  const { name, email, password, role } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "EMPLOYER" && {
        employer: {
          create: { companyName: "Your Company", verifiedStatus: false },
        },
      }),
      ...(role === "JOBSEEKER" && {
        jobSeeker: { create: {} },
      }),
      ...(role === "ADMIN" && {
        admin: { create: {} },
      }),
    },
  });

  return Response.json({ message: "User registered", userId: newUser.id });
}
