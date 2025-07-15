import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
  })

  if (!job) {
    return new Response('Not found', { status: 404 })
  }

  return Response.json(job)
}
