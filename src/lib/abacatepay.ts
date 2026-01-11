import AbacatePay from "abacatepay-nodejs-sdk"

const apiKey = process.env.ABACATEPAY_API_KEY

if (!apiKey) {
  console.warn("ABACATEPAY_API_KEY is not set")
}

export const abacatepay = apiKey ? AbacatePay(apiKey) : null

export async function createDepositBilling(
  userId: string,
  userEmail: string,
  amountCents: number
) {
  if (!abacatepay) {
    throw new Error("AbacatePay not configured")
  }

  const billing = await abacatepay.billing.create({
    frequency: "ONE_TIME",
    methods: ["PIX"],
    products: [
      {
        externalId: `deposit-${userId}-${Date.now()}`,
        name: "Depósito Deadline Daddy",
        description: `Depósito de R$ ${(amountCents / 100).toFixed(2)} na carteira`,
        quantity: 1,
        price: amountCents,
      },
    ],
    returnUrl: `${process.env.BETTER_AUTH_URL}/carteira`,
    completionUrl: `${process.env.BETTER_AUTH_URL}/carteira?deposito=sucesso`,
    customer: {
      email: userEmail,
    },
  })

  return billing
}
