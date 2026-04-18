import { prisma } from "@/lib/prisma";

export async function createNotification({
  userId, type, title, body, link, actorName, actorImage, connectionId,
}: {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  actorName?: string;
  actorImage?: string;
  connectionId?: string;
}) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        link: link ?? null,
        actorName: actorName ?? null,
        actorImage: actorImage ?? null,
        connectionId: connectionId ?? null,
      },
    });
  } catch (e) {
    console.error("Failed to create notification:", e);
  }
}