"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "@/lib/auth-client"
import { useServiceWorker } from "@/hooks/use-service-worker"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Flame,
  LayoutDashboard,
  Wallet,
  Settings,
  LogOut,
  Plus,
  Zap,
} from "lucide-react"

type UserStats = {
  balance: number
  currentStreak: number
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [stats, setStats] = useState<UserStats>({ balance: 0, currentStreak: 0 })

  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useServiceWorker()

  const navItems = [
    { href: "/dashboard", label: "Tarefas", icon: LayoutDashboard },
    { href: "/carteira", label: "Carteira", icon: Wallet },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
  ]

  function formatCurrency(cents: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100)
  }

  async function fetchStats() {
    const response = await fetch("/api/user")
    if (response.ok) {
      const data = await response.json()
      setStats({ balance: data.balance, currentStreak: data.currentStreak })
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push("/login")
  }

  useEffect(() => {
    if (session?.user) {
      fetchStats()
    }
  }, [session?.user, pathname])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    )
  }

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Deadline Daddy
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="w-4 h-4" role="presentation" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/50 rounded-full">
              <Zap className="w-4 h-4 text-orange-500" role="presentation" />
              <span className="text-sm font-medium">{stats.currentStreak}</span>
            </div>

            <Badge variant="secondary" className="hidden sm:flex gap-1">
              <Wallet className="w-3 h-3" role="presentation" />
              {formatCurrency(stats.balance)}
            </Badge>

            <Link href="/tarefa/nova">
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Plus className="w-4 h-4" role="presentation" />
                <span className="hidden sm:inline">Nova Tarefa</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  title="Menu do usuário"
                  aria-label="Menu do usuário"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <div className="md:hidden">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="gap-2">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </div>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="gap-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
