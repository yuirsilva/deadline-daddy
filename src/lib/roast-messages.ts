export const failureRoasts = [
  "Parabéns. Você não fez nada de novo. R${amount} bem investidos.",
  "Eu acreditei em você. Minha carteira ainda acredita.",
  "Mais uma tarefa esquecida. Obrigado pelo café! ☕",
  "Produtividade? Nunca ouvi falar.",
  "Seu eu do futuro está decepcionado.",
  "R${amount} a menos na conta. A preguiça cobra caro.",
  "Mais um dia, mais uma multa. Consistência é tudo! 💀",
  "Desculpa, mas não dá pra culpar ninguém dessa vez.",
  "Deadline passou. Seu dinheiro também.",
  "Se procrastinar fosse olimpíada, você era ouro. R${amount}.",
  "Tentou? Não. Falhou? Sim. Pagou? Com certeza.",
  "Relaxa, amanhã você tenta de novo. Por R${amount}.",
  "A intenção era boa. A execução, nem tanto. R${amount}.",
  "Você escolheu Netflix ao invés de fazer isso? R${amount}.",
  "Aquele cochilo saiu caro: R${amount}.",
]

export const streakBreakRoasts = [
  "Sequência de {streak} dias quebrada. Voltamos à estaca zero.",
  "Era uma sequência tão bonita... {streak} dias. RIP.",
  "Você destruiu {streak} dias de progresso. Parabéns.",
  "De herói a zero em um dia. Adeus, sequência de {streak}.",
  "{streak} dias jogados no lixo. A preguiça venceu.",
]

export const successMessages = [
  "Tarefa concluída! Seu eu do futuro agradece.",
  "Mandou bem! Dinheiro salvo, orgulho intacto.",
  "É isso aí! Continuando produtivo.",
  "Missão cumprida. Nada de multa hoje! 🎉",
  "Você venceu a procrastinação. Por hoje.",
]

export const streakMilestones = [
  { days: 3, message: "3 dias seguidos! Está criando um hábito." },
  { days: 7, message: "Uma semana completa! 🔥 Você é imparável!" },
  { days: 14, message: "2 semanas de consistência! Lendário!" },
  { days: 30, message: "1 mês! Você é uma máquina de produtividade! 🏆" },
]

export function getFailureRoast(amount: number): string {
  const roast = failureRoasts[Math.floor(Math.random() * failureRoasts.length)]
  return roast.replace(
    /R\$\{amount\}/g,
    `R$${(amount / 100).toFixed(2).replace(".", ",")}`
  )
}

export function getStreakBreakRoast(streak: number): string {
  const roast =
    streakBreakRoasts[Math.floor(Math.random() * streakBreakRoasts.length)]
  return roast.replace(/\{streak\}/g, streak.toString())
}

export function getSuccessMessage(): string {
  return successMessages[Math.floor(Math.random() * successMessages.length)]
}

export function getStreakMilestone(
  days: number
): { days: number; message: string } | null {
  return streakMilestones.find((m) => m.days === days) || null
}
