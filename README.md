# Deadline Daddy 🔥

App de tarefas com multas financeiras. Seja produtivo ou banque meu café.

## Como Funciona

1. **Crie uma tarefa** - Defina o que precisa fazer
2. **Defina o prazo** - Quando precisa estar pronto
3. **Defina a multa** - R$1 a R$100
4. **Envie prova** - Foto provando que completou
5. **Falhou?** - Paga a multa. Simples assim.

## Stack Tecnológica

- **Framework**: Next.js 16 + React 19 + React Compiler
- **Estilização**: Tailwind CSS + Shadcn UI
- **Autenticação**: Better-Auth
- **Pagamentos**: AbacatePay (PIX)
- **Banco de Dados**: Prisma + PostgreSQL (Neon)
- **Upload de Arquivos**: UploadThing
- **Notificações**: Web Push API
- **Deploy**: Vercel

## Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"

# AbacatePay
ABACATEPAY_API_KEY="..."

# UploadThing
UPLOADTHING_TOKEN="..."

# Web Push VAPID Keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_SUBJECT="mailto:..."

# Cron Secret (for Vercel Cron)
CRON_SECRET="..."
```

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma db push

# Rodar em desenvolvimento
npm run dev
```

## Deploy

O app está configurado para deploy no Vercel com Cron jobs para verificar prazos a cada 5 minutos.

## Roast Messages

Mensagens enviadas quando você falha:

- "Parabéns. Você não fez nada de novo. R$X bem investidos."
- "Eu acreditei em você. Minha carteira ainda acredita."
- "Mais uma tarefa esquecida. Obrigado pelo café!"
- "Produtividade? Nunca ouvi falar."
- "Seu eu do futuro está decepcionado."

---

Feito com ☕ financiado por procrastinadores
