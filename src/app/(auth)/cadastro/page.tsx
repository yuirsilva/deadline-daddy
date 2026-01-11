"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Flame } from "lucide-react"

function getCpfDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11)
}

function formatCpf(value: string) {
  const digits = getCpfDigits(value)

  if (digits.length <= 3) {
    return digits
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function isValidCpf(value: string) {
  const digits = getCpfDigits(value)

  if (digits.length !== 11) {
    return false
  }

  if (/^(\d)\1+$/.test(digits)) {
    return false
  }

  const numbers = digits.split("").map(Number)

  let sum = 0
  for (let index = 0; index < 9; index += 1) {
    sum += numbers[index] * (10 - index)
  }

  let firstCheck = (sum * 10) % 11
  if (firstCheck === 10) {
    firstCheck = 0
  }

  if (firstCheck !== numbers[9]) {
    return false
  }

  sum = 0
  for (let index = 0; index < 10; index += 1) {
    sum += numbers[index] * (11 - index)
  }

  let secondCheck = (sum * 10) % 11
  if (secondCheck === 10) {
    secondCheck = 0
  }

  return secondCheck === numbers[10]
}

export default function CadastroPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cellphone, setCellphone] = useState("")
  const [taxId, setTaxId] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  function handleTaxIdChange(value: string) {
    setTaxId(formatCpf(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const trimmedCellphone = cellphone.trim()
    const taxIdDigits = getCpfDigits(taxId)

    if (!trimmedCellphone || !taxIdDigits) {
      setError("Informe seu celular e CPF")
      return
    }

    if (!isValidCpf(taxIdDigits)) {
      setError("Informe um CPF válido")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setIsLoading(true)

    const result = await signUp.email({
      email,
      password,
      name,
      cellphone: trimmedCellphone,
      taxId: formatCpf(taxIdDigits),
    })

    if (result.error) {
      setError(result.error.message || "Erro ao criar conta")
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-900/50 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-2">
          <Flame className="w-7 h-7 text-white" role="presentation" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Criar Conta
        </CardTitle>
        <CardDescription className="text-base">
          Prepare-se para ser produtivo (ou bancar meu café)
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cellphone">Celular</Label>
            <Input
              id="cellphone"
              type="tel"
              placeholder="Seu celular"
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
              required
              autoComplete="tel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">CPF</Label>
            <Input
              id="taxId"
              type="text"
              placeholder="000.000.000-00"
              value={taxId}
              onChange={(e) => handleTaxIdChange(e.target.value)}
              required
              inputMode="numeric"
              maxLength={14}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-orange-600 hover:text-orange-700 font-medium underline-offset-4 hover:underline"
            >
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
