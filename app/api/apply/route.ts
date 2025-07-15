import { authOptions } from '@/app/lib/auth'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  // const session = await getServerSession(authOptions)
  // if (!session || session.user.role !== 'JOBSEEKER') {
  //   return new Response('Unauthorized', { status: 401 })
  // }
  console.log ('api apply')
  const { coverLetter } = await req.json()
  console.log('api yout')
  // prevent duplicate application
  // const existing = await prisma.application.findFirst({
  //   where: { userId: session.user.id, jobId },
  // })

  // if (existing) {
  //   return new Response('You have already applied for this job.', { status: 400 })
  // }

  // const app = await prisma.application.create({
  //   data: {
  //     jobId,
  //     userId: session.user.id,
  //     coverLetter,
  //   },
  // })

  // return Response.json(app)
}
