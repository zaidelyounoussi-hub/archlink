export const dynamic = "force-dynamic";
// app/api/architects/portfolio/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { title, description, imageUrl, year } = await req.json();

  if (!title) return NextResponse.json({ error: "Title required." }, { status: 400 });

  const profile = await prisma.architectProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  const item = await prisma.portfolioItem.create({
    data: { profileId: profile.id, title, description, imageUrl, year },
  });

  return NextResponse.json(item);
}
