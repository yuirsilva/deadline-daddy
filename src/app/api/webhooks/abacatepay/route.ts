import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.event !== "billing.paid") {
    return NextResponse.json({ received: true })
  }

  const billingId = body.data?.billing?.id || body.data?.pixQrCode?.id
  const amount = body.data?.payment?.amount

  if (!billingId || !amount) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const payment = await db.payment.findFirst({
    where: { externalId: billingId },
  })

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 })
  }

  if (payment.status === "COMPLETED") {
    return NextResponse.json({ received: true })
  }

  await db.$transaction([
    db.payment.update({
      where: { id: payment.id },
      data: { status: "COMPLETED" },
    }),
    db.user.update({
      where: { id: payment.userId },
      data: { balance: { increment: amount } },
    }),
  ])

  return NextResponse.json({ received: true })
}
