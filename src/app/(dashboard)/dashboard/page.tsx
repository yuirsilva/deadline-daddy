"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Flame,
  TrendingUp,
  Wallet,
  Loader2,
} from "lucide-react"

type Task = {
  id: string
  title: string
  deadline: string
  penalty: number
  status: "PENDING" | "COMPLETED" | "FAILED"
}

type Stats = {
  pending: number
  completed: number
  failed: number
  totalLost: number
  currentStreak: number
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<Stats>({
    pending: 0,
    completed: 0,
    failed: 0,
    totalLost: 0,
    currentStreak: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  function formatCurrency(cents: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100)
  }

  function formatDeadline(date: string) {
    const now = new Date()
    const deadline = new Date(date)
    const diff = deadline.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (diff < 0) return "Expirado"
    if (days > 0) return `${days}d restantes`
    if (hours > 0) return `${hours}h restantes`
    return "Menos de 1h"
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

  function getStatusBadge(status: string) {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
            Concluída
          </Badge>
        )
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400">
            Falhou
          </Badge>
        )
      default:
        return (
          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400">
            Pendente
          </Badge>
        )
    }
  }

  async function fetchData() {
    const [tasksRes, statsRes] = await Promise.all([
      fetch("/api/tasks"),
      fetch("/api/user"),
    ])

    if (tasksRes.ok) {
      const tasksData = await tasksRes.json()
      setTasks(tasksData)
    }

    if (statsRes.ok) {
      const statsData = await statsRes.json()
      setStats(statsData)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Suas Tarefas</h1>
          <p className="text-muted-foreground">
            Cumpra os prazos ou pague o preço
          </p>
        </div>
        <Link href="/tarefa/nova">
          <Button className="gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
            <Plus className="w-4 h-4" role="presentation" />
            Nova Tarefa
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="w-4 h-4 text-orange-500" role="presentation" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle2
              className="w-4 h-4 text-green-500"
              role="presentation"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sequência</CardTitle>
            <Flame className="w-4 h-4 text-orange-500" role="presentation" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {stats.currentStreak}
              {stats.currentStreak > 0 && (
                <TrendingUp className="w-4 h-4 text-green-500" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Perdido</CardTitle>
            <Wallet className="w-4 h-4 text-red-500" role="presentation" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(stats.totalLost)}
            </div>
          </CardContent>
        </Card>
      </div>

      {tasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 text-orange-500" role="presentation" />
            </div>
            <CardTitle className="mb-2">Nenhuma tarefa ainda</CardTitle>
            <CardDescription className="text-center mb-4">
              Crie sua primeira tarefa e comece a ser produtivo
              <br />
              (ou comece a me pagar café)
            </CardDescription>
            <Link href="/tarefa/nova">
              <Button className="gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                <Plus className="w-4 h-4" role="presentation" />
                Criar Primeira Tarefa
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Link key={task.id} href={`/tarefa/${task.id}`}>
              <Card className="hover:border-orange-300 dark:hover:border-orange-800 transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.status === "PENDING"
                          ? formatDeadline(task.deadline)
                          : task.status === "COMPLETED"
                            ? "Concluída"
                            : "Prazo perdido"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-red-500">
                      {formatCurrency(task.penalty)}
                    </span>
                    {getStatusBadge(task.status)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
