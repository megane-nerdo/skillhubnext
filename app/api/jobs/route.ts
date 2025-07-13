import { handler } from '../auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/app/generated/prisma'
const prisma = new PrismaClient()

export async function POST(req: Request) {
  console.log('POST /api/jobs')
  const session = await getServerSession(handler) as { user: { id: string; role: string } } | null
  if (session?.user.role !== 'EMPLOYER') {
    console.log('Unauthorized access attempt by:', session?.user)
  }
  if (!session || session.user.role !== 'EMPLOYER') {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const job = await prisma.job.create({
    data: {
      ...body,
      employerId: session.user.id,
    },
  })

  return Response.json(job)
}
