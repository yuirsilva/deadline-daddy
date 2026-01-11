import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { createDepositBilling } from "@/lib/abacatepay"

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const body = await request.json()
  const { amount } = body

  if (!amount || amount < 100 || amount > 10000) {
    return NextResponse.json(
      { error: "Valor inválido. Mínimo R$1, máximo R$100" },
      { status: 400 }
    )
  }

  const billing = await createDepositBilling(
    session.user.id,
    session.user.email,
    amount
  )

  await db.payment.create({
    data: {
      amount,
      type: "DEPOSIT",
      status: "PENDING",
      externalId: billing.data.id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ url: billing.data.url })
}
