import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ users: [] });
  const userId = (session.user as any).id;

  // Get all connected user IDs
  const connections = await prisma.connection.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    select: { senderId: true, receiverId: true },
  });
  const connectedIds = new Set(connections.flatMap(c => [c.senderId, c.receiverId]));
  connectedIds.add(userId);

  // Get random users not connected
  const users = await prisma.user.findMany({
    where: { id: { notIn: Array.from(connectedIds) } },
    select: {
      id: true, name: true, image: true, role: true,
      architectProfile: { select: { specialty: true, location: true } },
    },
    take: 20,
  });

  // Shuffle and return 8
  const shuffled = users.sort(() => Math.random() - 0.5).slice(0, 8);
  return NextResponse.json({ users: shuffled });
}