"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, CalendarIcon, Flame } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

export default function NovaTarefaPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [hour, setHour] = useState("18")
  const [minute, setMinute] = useState("00")
  const [penalty, setPenalty] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const penaltyPresets = [100, 500, 1000, 2000, 5000, 10000]
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  )
  const minutes = ["00", "15", "30", "45"]

  function formatCurrency(cents: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Digite um título para a tarefa")
      return
    }

    if (!date) {
      toast.error("Selecione uma data")
      return
    }

    const penaltyCents = Math.round(parseFloat(penalty) * 100)
    if (isNaN(penaltyCents) || penaltyCents < 100 || penaltyCents > 10000) {
      toast.error("Multa deve ser entre R$1 e R$100")
      return
    }

    const deadline = new Date(date)
    deadline.setHours(parseInt(hour), parseInt(minute), 0, 0)

    if (deadline <= new Date()) {
      toast.error("O prazo deve ser no futuro")
      return
    }

    setIsLoading(true)

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || null,
        deadline: deadline.toISOString(),
        penalty: penaltyCents,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      toast.error(data.error || "Erro ao criar tarefa")
      setIsLoading(false)
      return
    }

    toast.success("Tarefa criada! Agora é cumprir ou pagar 💪")
    router.push("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            title="Voltar"
            aria-label="Voltar para o dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nova Tarefa</h1>
          <p className="text-muted-foreground">
            Defina o que fazer e quanto vai doer se falhar
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Criar Tarefa
          </CardTitle>
          <CardDescription>
            Preencha os detalhes e comprometa-se (financeiramente)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">O que você vai fazer?</Label>
              <Input
                id="title"
                placeholder="Ex: Terminar relatório, Ir à academia, Estudar 2h..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detalhes (opcional)</Label>
              <Input
                id="description"
                placeholder="Mais informações sobre a tarefa..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
            </div>

            <div className="space-y-2">
              <Label>Prazo</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: ptBR })
                      ) : (
                        <span className="text-muted-foreground">
                          Selecione a data
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) =>
                        d < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}h
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}m
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quanto vai doer? (Multa)</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {penaltyPresets.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={
                      penalty === (preset / 100).toFixed(2)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setPenalty((preset / 100).toFixed(2))}
                    className={
                      penalty === (preset / 100).toFixed(2)
                        ? "bg-gradient-to-r from-orange-500 to-red-600"
                        : ""
                    }
                  >
                    {formatCurrency(preset)}
                  </Button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="1"
                  max="100"
                  placeholder="0,00"
                  value={penalty}
                  onChange={(e) => setPenalty(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Mínimo R$1, máximo R$100. Precisa ter saldo suficiente.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                {isLoading ? "Criando..." : "Criar Tarefa 🔥"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
