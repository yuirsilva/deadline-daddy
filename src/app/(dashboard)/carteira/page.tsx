"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

type Payment = {
  id: string
  amount: number
  type: "DEPOSIT" | "PENALTY" | "WITHDRAWAL"
  status: "PENDING" | "COMPLETED" | "FAILED"
  createdAt: string
}

export default function CarteiraPage() {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [balance, setBalance] = useState(0)
  const [payments, setPayments] = useState<Payment[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const depositoSucesso = searchParams.get("deposito") === "sucesso"

  const presetAmounts = [500, 1000, 2000, 5000]

  function formatCurrency(cents: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100)
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  async function fetchWallet() {
    const response = await fetch("/api/wallet")
    if (response.ok) {
      const data = await response.json()
      setBalance(data.balance)
      setPayments(data.payments)
    }
    setIsFetching(false)
  }

  async function handleDeposit() {
    const amountCents = Math.round(parseFloat(amount) * 100)

    if (isNaN(amountCents) || amountCents < 100 || amountCents > 10000) {
      toast.error("Valor inválido. Mínimo R$1, máximo R$100")
      return
    }

    setIsLoading(true)

    const response = await fetch("/api/wallet/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountCents }),
    })

    const data = await response.json()

    if (!response.ok) {
      toast.error(data.error || "Erro ao criar depósito")
      setIsLoading(false)
      return
    }

    window.location.href = data.url
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "DEPOSIT":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case "PENALTY":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      default:
        return <ArrowUpRight className="w-4 h-4 text-neutral-500" />
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-orange-500" />
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case "DEPOSIT":
        return "Depósito"
      case "PENALTY":
        return "Multa"
      default:
        return "Saque"
    }
  }

  useEffect(() => {
    if (depositoSucesso) {
      toast.success("Depósito realizado com sucesso!")
      router.replace("/carteira")
    }
    fetchWallet()
  }, [])

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Carteira</h1>
        <p className="text-muted-foreground">
          Gerencie seu saldo e histórico de transações
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Saldo Disponível</CardTitle>
              <Wallet className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {formatCurrency(balance)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Disponível para multas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Depositar via PIX</CardTitle>
            <CardDescription>
              Adicione saldo para criar tarefas com multas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount((preset / 100).toFixed(2))}
                  className="flex-1 min-w-[4rem]"
                >
                  {formatCurrency(preset)}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor personalizado</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  max="100"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              onClick={handleDeposit}
              disabled={isLoading || !amount}
              className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Plus className="w-4 h-4" role="presentation" />
              {isLoading ? "Gerando PIX..." : "Depositar via PIX"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico</CardTitle>
          <CardDescription>Suas transações recentes</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma transação ainda</p>
              <p className="text-sm">Faça seu primeiro depósito para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(payment.type)}
                      <div>
                        <p className="font-medium">
                          {getTypeLabel(payment.type)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-medium ${
                          payment.type === "DEPOSIT"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {payment.type === "DEPOSIT" ? "+" : "-"}
                        {formatCurrency(payment.amount)}
                      </span>
                      {getStatusIcon(payment.status)}
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
