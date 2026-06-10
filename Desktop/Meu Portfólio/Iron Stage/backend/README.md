# Iron Stage — Backend API

API REST do **Iron Stage** construída com **NestJS + TypeScript + PostgreSQL + Prisma**.

## Por que TypeScript + NestJS?

| Critério | NestJS + TypeScript |
|----------|---------------------|
| **Mesma linguagem do frontend** | Tipos compartilháveis, uma equipe, menos contexto |
| **Escalabilidade** | Arquitetura modular → microserviços quando crescer |
| **Mercado** | Ecossistema maduro para pagamentos (Stripe, Mercado Pago) |
| **Manutenção** | Injeção de dependência, guards, pipes, testes nativos |
| **Performance** | Suficiente para streaming metadata, e-commerce e auth; workers separados para vídeo |

Alternativas consideradas: **Go** (máxima performance, curva maior) e **Java/Spring** (enterprise, mais pesado para MVP).

## Regras de negócio implementadas

### Comissões (configuráveis via `.env`)

| Tipo | Comissão plataforma | Repasse banda |
|------|---------------------|---------------|
| Pay-Per-View | 20% | 80% |
| Marketplace | 15% | 85% |
| Assinatura | 30% | 100% plataforma* |

\* No MVP, assinaturas são receita da plataforma. Repasse por consumo (modelo pro-rata) entra em fase futura.

### Acesso a conteúdo

- **FREE** — qualquer usuário
- **SUBSCRIPTION** — requer plano ativo (Iron Premium/Basic)
- **PURCHASE** — compra avulsa registrada em `ContentAccess`

### Pay-Per-View

- Banda deve estar **VERIFIED**
- Preço entre R$ 10,00 e R$ 500,00 (configurável)
- Acesso: 1h antes do show até 24h após o término
- Split automático na compra do ingresso

### Marketplace

- Banda **VERIFIED** obrigatória
- Controle de estoque
- Split por banda no pedido (multi-banda suportado)

### Repasses

- Saldo mínimo para saque: **R$ 50,00**
- Bandas consultam earnings e solicitam payout

## Módulos

```
src/
├── auth/              # JWT — registro e login
├── bands/             # Cadastro, verificação, follow
├── subscriptions/     # Planos e assinaturas
├── content/           # Catálogo VOD e controle de acesso
├── live-shows/        # PPV — agendar e comprar ingresso
├── marketplace/       # Produtos e pedidos
├── payments/          # Regras de comissão e repasses
├── commission/        # Motor de split de receita
└── access-control/    # Regras de permissão centralizadas
```

## Como rodar

### 1. Subir o PostgreSQL

Na raiz do projeto (`Iron Stage/`):

```bash
docker compose up -d
```

### 2. Configurar e migrar

```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 3. Iniciar a API

```bash
npm run start:dev
```

API disponível em **http://localhost:3001/api**

Health check: `GET /api/health`

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastro (FAN ou BAND) |
| POST | `/api/auth/login` | Login JWT |
| GET | `/api/bands` | Listar bandas |
| POST | `/api/bands` | Criar banda (autenticado) |
| POST | `/api/bands/:id/verify` | Verificar banda (ADMIN) |
| GET | `/api/subscriptions/plans` | Planos disponíveis |
| POST | `/api/subscriptions/subscribe` | Assinar plano |
| GET | `/api/content` | Catálogo publicado |
| GET | `/api/live-shows/upcoming` | Próximos shows PPV |
| POST | `/api/live-shows/purchase` | Comprar ingresso PPV |
| GET | `/api/marketplace/products` | Produtos da loja |
| POST | `/api/marketplace/orders` | Criar pedido |
| GET | `/api/payments/commission-rules` | Regras de comissão |
| GET | `/api/payments/bands/:id/earnings` | Ganhos da banda |

## Credenciais de seed

- **Admin:** `admin@ironstage.com` / `admin123`

## Próximos passos

- [ ] Integração Mercado Pago / Stripe (webhooks)
- [ ] Redis + Bull para filas de pagamento e e-mail
- [ ] Upload de mídia (S3) e URLs assinadas de stream
- [ ] WebSockets para status de shows ao vivo
- [ ] Pacote `shared` com tipos TypeScript compartilhados com o frontend
