import { NextRequest, NextResponse } from "next/server"
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

  const tasks = await db.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, deadline, penalty } = body

  if (!title || !deadline || !penalty) {
    return NextResponse.json(
      { error: "Título, prazo e multa são obrigatórios" },
      { status: 400 }
    )
  }

  if (penalty < 100 || penalty > 10000) {
    return NextResponse.json(
      { error: "Multa deve ser entre R$1 e R$100" },
      { status: 400 }
    )
  }

  const deadlineDate = new Date(deadline)
  if (deadlineDate <= new Date()) {
    return NextResponse.json(
      { error: "Prazo deve ser no futuro" },
      { status: 400 }
    )
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true },
  })

  if (!user || user.balance < penalty) {
    return NextResponse.json(
      { error: "Saldo insuficiente para esta multa" },
      { status: 400 }
    )
  }

  const task = await db.task.create({
    data: {
      title,
      description,
      deadline: deadlineDate,
      penalty,
      userId: session.user.id,
    },
  })

  return NextResponse.json(task)
}
