export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const connections = await prisma.connection.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
      receiver: { select: { id: true, name: true, image: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(connections);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const senderId = (session.user as any).id;
  const { receiverId } = await req.json();

  if (senderId === receiverId) return NextResponse.json({ error: "Cannot connect with yourself" }, { status: 400 });

  const existing = await prisma.connection.findFirst({
    where: { OR: [{ senderId, receiverId }, { senderId: receiverId, receiverId: senderId }] },
  });
  if (existing) return NextResponse.json({ error: "Connection already exists" }, { status: 409 });

  const connection = await prisma.connection.create({
    data: { senderId, receiverId },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
      receiver: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { name: true, image: true } });

  // Store connectionId in the link so bell can use it
  await createNotification({
    userId: receiverId,
    type: "connection",
    title: (sender?.name ?? "Someone") + " wants to connect",
    body: "Tap Accept or Decline to respond to this request.",
    link: "/account",
    actorName: sender?.name ?? undefined,
    actorImage: sender?.image ?? undefined,
    connectionId: connection.id,
  });

  return NextResponse.json(connection);
}