import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      balance: true,
      currentStreak: true,
      longestStreak: true,
    },
  })

  const stats = await db.task.groupBy({
    by: ["status"],
    where: { userId: session.user.id },
    _count: true,
  })

  const totalLost = await db.payment.aggregate({
    where: {
      userId: session.user.id,
      type: "PENALTY",
      status: "COMPLETED",
    },
    _sum: { amount: true },
  })

  const statusCounts = stats.reduce(
    (acc, stat) => {
      acc[stat.status.toLowerCase()] = stat._count
      return acc
    },
    { pending: 0, completed: 0, failed: 0 } as Record<string, number>
  )

  return NextResponse.json({
    balance: user?.balance || 0,
    currentStreak: user?.currentStreak || 0,
    longestStreak: user?.longestStreak || 0,
    pending: statusCounts.pending,
    completed: statusCounts.completed,
    failed: statusCounts.failed,
    totalLost: totalLost._sum.amount || 0,
  })
}
