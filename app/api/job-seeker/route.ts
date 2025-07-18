// app/api/jobseeker/route.ts
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const jobSeekers = await prisma.jobSeeker.findMany({
      include: { user: true },
    })
    return NextResponse.json(jobSeekers)
  } catch (error) {
    console.error('Error fetching job seekers:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    // Delete job seeker (and optionally, the user)
    await prisma.jobSeeker.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting job seeker:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
