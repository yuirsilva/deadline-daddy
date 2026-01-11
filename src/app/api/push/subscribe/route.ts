import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const body = await request.json()
  const { subscription } = body

  if (!subscription) {
    return NextResponse.json(
      { error: "Subscription required" },
      { status: 400 }
    )
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { pushSubscription: JSON.stringify(subscription) },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { pushSubscription: null },
  })

  return NextResponse.json({ success: true })
}
