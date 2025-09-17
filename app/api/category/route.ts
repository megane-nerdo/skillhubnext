import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name } = body;

  try {
    const category = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const categories = await prisma.category.findMany();
  if (!categories || categories.length === 0) {
    return NextResponse.json({ error: "No category found" }, { status: 404 });
  }
  return NextResponse.json(categories, { status: 200 });
}
