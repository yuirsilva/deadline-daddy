"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Settings, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function ConfiguracoesPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default")
  const [isLoading, setIsLoading] = useState(false)

  function checkNotificationStatus() {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission)

      if (Notification.permission === "granted") {
        navigator.serviceWorker?.ready.then(async (registration) => {
          const subscription =
            await registration.pushManager.getSubscription()
          setNotificationsEnabled(!!subscription)
        })
      }
    }
  }

  async function enableNotifications() {
    setIsLoading(true)

    if (!("Notification" in window)) {
      toast.error("Seu navegador não suporta notificações")
      setIsLoading(false)
      return
    }

    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)

    if (permission !== "granted") {
      toast.error("Permissão de notificação negada")
      setIsLoading(false)
      return
    }

    const registration = await navigator.serviceWorker.ready
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

    if (!vapidPublicKey) {
      toast.error("Configuração de notificações não disponível")
      setIsLoading(false)
      return
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    })

    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription }),
    })

    if (!response.ok) {
      toast.error("Erro ao ativar notificações")
      setIsLoading(false)
      return
    }

    setNotificationsEnabled(true)
    toast.success("Notificações ativadas! Prepare-se para os roasts 🔥")
    setIsLoading(false)
  }

  async function disableNotifications() {
    setIsLoading(true)

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
    }

    await fetch("/api/push/subscribe", { method: "DELETE" })

    setNotificationsEnabled(false)
    toast.success("Notificações desativadas")
    setIsLoading(false)
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  useEffect(() => {
    checkNotificationStatus()
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Notificações Push</CardTitle>
                <CardDescription>
                  Receba alertas e roasts diretamente no navegador
                </CardDescription>
              </div>
            </div>
            {notificationsEnabled ? (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Ativo
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <BellOff className="w-3 h-3" />
                Inativo
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <p className="text-sm font-medium">O que você vai receber:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Alertas de prazos próximos</li>
              <li>• Roasts quando falhar (é pra doer mesmo)</li>
              <li>• Comemorações de sequências</li>
              <li>• Lembretes motivacionais (ou não)</li>
            </ul>
          </div>

          {notificationPermission === "denied" ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                Notificações bloqueadas. Para ativar, acesse as configurações do
                navegador e permita notificações para este site.
              </p>
            </div>
          ) : notificationsEnabled ? (
            <Button
              variant="outline"
              onClick={disableNotifications}
              disabled={isLoading}
              className="w-full gap-2"
            >
              <BellOff className="w-4 h-4" />
              {isLoading ? "Desativando..." : "Desativar Notificações"}
            </Button>
          ) : (
            <Button
              onClick={enableNotifications}
              disabled={isLoading}
              className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Bell className="w-4 h-4" />
              {isLoading ? "Ativando..." : "Ativar Notificações 🔥"}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Preferências</CardTitle>
              <CardDescription>
                Mais opções em breve
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Novas configurações serão adicionadas aqui
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
