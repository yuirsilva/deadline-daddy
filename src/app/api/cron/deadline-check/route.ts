import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendPushNotification } from "@/lib/push-notifications"
import { getFailureRoast, getStreakBreakRoast } from "@/lib/roast-messages"

const PLATFORM_FEE_PERCENTAGE = 20

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const expiredTasks = await db.task.findMany({
    where: {
      status: "PENDING",
      deadline: { lt: new Date() },
    },
    include: { user: true },
  })

  const results = []

  for (const task of expiredTasks) {
    const previousStreak = task.user.currentStreak
    const platformFee = Math.floor(
      (task.penalty * PLATFORM_FEE_PERCENTAGE) / 100
    )

    await db.$transaction([
      db.task.update({
        where: { id: task.id },
        data: { status: "FAILED" },
      }),
      db.user.update({
        where: { id: task.userId },
        data: {
          balance: { decrement: task.penalty },
          currentStreak: 0,
        },
      }),
      db.payment.create({
        data: {
          amount: task.penalty,
          type: "PENALTY",
          status: "COMPLETED",
          taskId: task.id,
          userId: task.userId,
        },
      }),
    ])

    if (task.user.pushSubscription) {
      const roast = getFailureRoast(task.penalty)
      let body = roast

      if (previousStreak > 0) {
        body += `\n\n${getStreakBreakRoast(previousStreak)}`
      }

      await sendPushNotification(
        task.user.pushSubscription,
        `💀 ${task.title}`,
        body,
        `/tarefa/${task.id}`
      )
    }

    results.push({
      taskId: task.id,
      userId: task.userId,
      penalty: task.penalty,
      platformFee,
      previousStreak,
    })
  }

  return NextResponse.json({
    processed: results.length,
    results,
  })
}

export async function GET(request: NextRequest) {
  return POST(request)
}
