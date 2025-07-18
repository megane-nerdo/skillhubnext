import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name } = body;
    
    try {
        const industry = await prisma.industry.create({
            data: { name }
        });
        return NextResponse.json(industry, { status: 201 });
    } catch (error) {
        console.error('Error creating industry:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const industries = await prisma.industry.findMany();
    if (!industries || industries.length === 0) {
        return NextResponse.json({ error: 'No industries found' }, { status: 404 });
    }
    return NextResponse.json(industries , { status: 200 });
}