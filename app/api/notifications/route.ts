import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId, read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: NextRequest) {
  // Internal API to create notifications - called from other routes
  const { userId, type, title, body, link, actorName, actorImage } = await req.json();

  const notification = await prisma.notification.create({
    data: { userId, type, title, body, link, actorName, actorImage },
  });

  return NextResponse.json(notification);
}