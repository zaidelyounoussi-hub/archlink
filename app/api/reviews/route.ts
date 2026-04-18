export const dynamic = "force-dynamic";
// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId, rating, comment } = await req.json();
  const authorId = (session.user as any).id;

  if (!subjectId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  }

  if (authorId === subjectId) {
    return NextResponse.json({ error: "You cannot review yourself." }, { status: 400 });
  }

  try {
    const review = await prisma.review.create({
      data: { authorId, subjectId, rating, comment },
    });
    return NextResponse.json(review);
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "You already reviewed this architect." }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
