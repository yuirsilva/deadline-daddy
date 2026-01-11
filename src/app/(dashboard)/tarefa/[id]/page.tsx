"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Clock,
  Wallet,
  CheckCircle2,
  XCircle,
  Camera,
  Trash2,
  Flame,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { UploadButton } from "@/lib/uploadthing"

type Task = {
  id: string
  title: string
  description: string | null
  deadline: string
  penalty: number
  status: "PENDING" | "COMPLETED" | "FAILED"
  proofUrl: string | null
  createdAt: string
}

export default function TarefaDetailPage() {
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  function formatCurrency(cents: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100)
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  function getTimeRemaining(deadline: string) {
    const now = new Date()
    const diff = new Date(deadline).getTime() - now.getTime()

    if (diff <= 0) return "Expirado"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h restantes`
    if (hours > 0) return `${hours}h ${minutes}m restantes`
    return `${minutes}m restantes`
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Concluída
          </Badge>
        )
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 gap-1">
            <XCircle className="w-3 h-3" />
            Falhou
          </Badge>
        )
      default:
        return (
          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400 gap-1">
            <Clock className="w-3 h-3" />
            Pendente
          </Badge>
        )
    }
  }

  async function fetchTask() {
    const response = await fetch(`/api/tasks/${taskId}`)

    if (!response.ok) {
      toast.error("Tarefa não encontrada")
      router.push("/dashboard")
      return
    }

    const data = await response.json()
    setTask(data)
    setIsLoading(false)
  }

  async function handleUploadComplete(url: string) {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proofUrl: url }),
    })

    if (!response.ok) {
      const data = await response.json()
      toast.error(data.error || "Erro ao enviar prova")
      return
    }

    toast.success("Prova enviada! Tarefa concluída! 🎉")
    fetchTask()
  }

  async function handleDelete() {
    setIsDeleting(true)

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const data = await response.json()
      toast.error(data.error || "Erro ao excluir tarefa")
      setIsDeleting(false)
      return
    }

    toast.success("Tarefa excluída")
    router.push("/dashboard")
  }

  useEffect(() => {
    fetchTask()
  }, [taskId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!task) {
    return null
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <p className="text-muted-foreground">
            Criada em {formatDate(task.createdAt)}
          </p>
        </div>
        {getStatusBadge(task.status)}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Detalhes</CardTitle>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {task.description && (
            <>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Descrição
                </p>
                <p>{task.description}</p>
              </div>
              <Separator />
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Prazo</p>
                <p className="font-medium">{formatDate(task.deadline)}</p>
                {task.status === "PENDING" && (
                  <p className="text-sm text-orange-600 font-medium">
                    {getTimeRemaining(task.deadline)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Wallet className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Multa</p>
                <p className="font-medium text-red-600">
                  {formatCurrency(task.penalty)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {task.status === "PENDING" && (
        <Card className="border-orange-200 dark:border-orange-900/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-500" />
              Enviar Prova
            </CardTitle>
            <CardDescription>
              Envie uma foto provando que completou a tarefa antes do prazo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadButton
              endpoint="proofUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.ufsUrl) {
                  handleUploadComplete(res[0].ufsUrl)
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Erro no upload: ${error.message}`)
              }}
              appearance={{
                button:
                  "w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 ut-uploading:bg-orange-500",
                allowedContent: "text-muted-foreground text-sm",
              }}
              content={{
                button({ ready, isUploading }) {
                  if (isUploading) return "Enviando..."
                  if (ready) return "Enviar Foto 📸"
                  return "Carregando..."
                },
                allowedContent: "Imagens até 4MB",
              }}
            />
          </CardContent>
        </Card>
      )}

      {task.status === "COMPLETED" && task.proofUrl && (
        <Card className="border-green-200 dark:border-green-900/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              Tarefa Concluída!
            </CardTitle>
            <CardDescription>
              Parabéns! Você economizou {formatCurrency(task.penalty)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src={task.proofUrl}
              alt="Prova de conclusão"
              className="rounded-lg w-full max-h-96 object-cover"
            />
          </CardContent>
        </Card>
      )}

      {task.status === "FAILED" && (
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Tarefa Falhou
            </CardTitle>
            <CardDescription>
              Você perdeu {formatCurrency(task.penalty)}. Que sirva de lição!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              &ldquo;Eu acreditei em você. Minha carteira ainda
              acredita.&rdquo;
            </p>
          </CardContent>
        </Card>
      )}

      {task.status === "PENDING" && (
        <div className="flex justify-end">
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 text-red-600">
                <Trash2 className="w-4 h-4" />
                Excluir Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir tarefa?</DialogTitle>
                <DialogDescription>
                  Esta ação não pode ser desfeita. A tarefa será permanentemente
                  excluída.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
