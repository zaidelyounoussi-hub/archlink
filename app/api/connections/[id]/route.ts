export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { status } = await req.json();

  const connection = await prisma.connection.findUnique({ where: { id: params.id } });
  if (!connection) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (connection.receiverId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!["accepted", "declined"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const updated = await prisma.connection.update({
    where: { id: params.id },
    data: { status },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
      receiver: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  // Mark the notification as responded in the database
  await prisma.notification.updateMany({
    where: {
      userId,
      type: "connection",
      OR: [
        { connectionId: params.id },
        { actorName: updated.sender.name },
      ],
      responded: null,
    },
    data: { responded: status, read: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const connection = await prisma.connection.findUnique({ where: { id: params.id } });
  if (!connection) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (connection.senderId !== userId && connection.receiverId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.connection.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}