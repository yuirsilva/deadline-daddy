import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params

  const task = await db.task.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!task) {
    return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
  }

  return NextResponse.json(task)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params

  const task = await db.task.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!task) {
    return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
  }

  if (task.status !== "PENDING") {
    return NextResponse.json(
      { error: "Tarefa já foi finalizada" },
      { status: 400 }
    )
  }

  const body = await request.json()
  const { proofUrl } = body

  if (proofUrl) {
    const updatedTask = await db.task.update({
      where: { id },
      data: {
        proofUrl,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    })

    await db.user.update({
      where: { id: session.user.id },
      data: {
        currentStreak: { increment: 1 },
      },
    })

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { currentStreak: true, longestStreak: true },
    })

    if (user && user.currentStreak > user.longestStreak) {
      await db.user.update({
        where: { id: session.user.id },
        data: { longestStreak: user.currentStreak },
      })
    }

    return NextResponse.json(updatedTask)
  }

  return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params

  const task = await db.task.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!task) {
    return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
  }

  if (task.status !== "PENDING") {
    return NextResponse.json(
      { error: "Não é possível excluir tarefa já finalizada" },
      { status: 400 }
    )
  }

  await db.task.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
