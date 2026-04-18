// app/api/architects/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const data = await req.json();

  const allowed = ["bio", "specialty", "location", "yearsExp", "website", "phone", "licenseNo", "priceRange", "services", "available"];
  const update: any = {};
  for (const key of allowed) {
    if (data[key] !== undefined) update[key] = data[key];
  }

  const profile = await prisma.architectProfile.upsert({
    where: { userId },
    update,
    create: { userId, ...update },
  });

  return NextResponse.json(profile);
}
