import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Flame,
  Clock,
  Wallet,
  Zap,
  Target,
  MessageSquare,
  ArrowRight,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Deadline Daddy
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/cadastro">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-sm font-medium text-orange-700 dark:text-orange-400">
              <Zap className="w-4 h-4" role="presentation" />
              Seja produtivo. Ou banque meu café.
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                Multas reais
              </span>
              <br />
              <span className="text-neutral-900 dark:text-neutral-100">
                para procrastinadores
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie tarefas, defina prazos e penalidades financeiras. Se você
              falhar, paga. Simples assim. O medo de perder dinheiro é o melhor
              motivador.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/cadastro">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg px-8"
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5" role="presentation" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Multas de R$1 a R$100 por tarefa
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur border-orange-200/50 dark:border-orange-900/30">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Crie Tarefas</CardTitle>
                <CardDescription>
                  Defina o que precisa fazer, quando é o prazo e quanto vai
                  doer se falhar.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur border-orange-200/50 dark:border-orange-900/30">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Prove que Fez</CardTitle>
                <CardDescription>
                  Envie uma foto como prova antes do prazo. Sem prova = sem
                  desculpa = multa.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur border-orange-200/50 dark:border-orange-900/30">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-2">
                  <Wallet className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Pague ou Cumpra</CardTitle>
                <CardDescription>
                  Falhou? O dinheiro sai da sua carteira. Cumpriu? Sua carteira
                  (e ego) agradecem.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-sm font-medium opacity-90">
                      Modo Provocação
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Notificações que doem
                  </h2>
                  <p className="text-white/80 text-lg">
                    Quando você falha, mandamos mensagens carinhosas tipo:
                  </p>
                  <div className="space-y-2">
                    <p className="italic text-white/90">
                      &ldquo;Parabéns. Você não fez nada de novo. R$5 bem
                      investidos.&rdquo;
                    </p>
                    <p className="italic text-white/90">
                      &ldquo;Eu acreditei em você. Minha carteira ainda
                      acredita.&rdquo;
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <Link href="/cadastro">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full md:w-auto gap-2"
                    >
                      Quero Sofrer
                      <ArrowRight className="w-5 h-5" role="presentation" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Deadline Daddy © 2026</span>
          </div>
          <p>Feito com ☕ financiado por procrastinadores</p>
        </div>
      </footer>
    </div>
  )
}
