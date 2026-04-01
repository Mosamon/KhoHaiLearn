import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.userStats.findUnique({
    where: { email: session.user.email },
  });

  return Response.json({ stats: row ? JSON.parse(row.statsJson) : null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const statsJson = JSON.stringify(body.stats);

  await prisma.userStats.upsert({
    where: { email: session.user.email },
    create: { email: session.user.email, statsJson },
    update: { statsJson },
  });

  return Response.json({ ok: true });
}
