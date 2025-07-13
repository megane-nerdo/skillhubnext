// app/api/register/route.ts
import { PrismaClient, Role } from "@/app/generated/prisma"
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const data = await req.json()
  const { name, email, password, role } = data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 })
  }

  const hashedPassword = await hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'EMPLOYER' && {
        employer: { create: { companyName: 'Your Company' } },
      }),
      ...(role === 'JOBSEEKER' && {
        jobSeeker: { create: {} },
      }),
    },
  })

  return Response.json({ message: 'User registered', userId: newUser.id })
}
