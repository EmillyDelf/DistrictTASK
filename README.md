# District Task

Gerenciador individual de tarefas desenvolvido como projeto acadêmico de Desenvolvimento Web II. A aplicação permite que cada usuário organize suas atividades em um ambiente privado, com autenticação, persistência de dados e interface responsiva.

A página inicial apresenta uma demonstração com dados fictícios.

## Funcionalidades

- **Autenticação e Conta:** Cadastro, login e logout seguros com e-mail e senha.
- **Gestão Completa de Tarefas (CRUD):** Criação, listagem, edição, conclusão, reabertura e exclusão de atividades.
- **Organização Avançada:** Pesquisa em tempo real por título, filtros combinados por status e prioridade, além de ordenação dinâmica.
- **Detalhamento:** Definição de prazos, descrições detalhadas e níveis de prioridade.
- **Métricas e Acompanhamento:** Indicadores visuais do progresso e resumo das tarefas.
- **Experiência do Usuário (UX):**
  - Alternância fluida entre temas claro e escuro.
  - Interface responsiva adaptada para desktop e dispositivos móveis.
  - Tratamento dedicado para estados de carregamento (*skeletons*), lista vazia, erros de servidor (`error.tsx`) e página 404 temática personalizada (`not-found.tsx`).

## Tecnologias

| Categoria | Tecnologias |
|---|---|
| Interface | Next.js 16, React 19, TypeScript |
| Estilização | Tailwind CSS 4, ShadCN/UI, Radix UI |
| Componentes e feedback | Lucide, Sonner, next-themes |
| Gerenciamento de estado | Zustand |
| Backend | Next.js Server Actions e Route Handlers |
| Banco de dados | MongoDB Atlas e Mongoose |
| Autenticação | NextAuth.js 4 e JWT |
| Proteção de senhas | bcryptjs |
| Rate Limiting | Upstash Redis |

## Arquitetura

O projeto utiliza o App Router do Next.js em uma arquitetura fullstack.

- **Server Actions:** executam o cadastro e as operações de gerenciamento de tarefas.
- **Route Handlers:** integram o fluxo de autenticação do NextAuth.
- **MongoDB Atlas:** armazena usuários e tarefas.
- **Mongoose:** realiza a modelagem e comunicação com o banco.
- **Zustand:** gerencia filtros, pesquisa, ordenação, diálogos e estados de interação do dashboard.
- **Revalidação:** operações de escrita confirmadas utilizam `revalidatePath("/dashboard")` para atualizar os dados apresentados.

A conexão com MongoDB utiliza o padrão Singleton para reutilização da conexão.

## Segurança

A aplicação implementa diferentes mecanismos de proteção:

- Senhas armazenadas com hash bcrypt, utilizando custo 12.
- Autenticação por credenciais com NextAuth e sessões JWT.
- Verificação de sessão nas páginas privadas e nas Server Actions.
- Isolamento das tarefas pelo identificador do usuário autenticado.
- Validação dos dados no servidor.
- Rate Limiting com Upstash Redis para proteção contra tentativas excessivas de login.

### Limitação de tentativas de login

| Critério | Limite |
|---|---|
| Tentativas por IP | 20 em 15 minutos |
| Falhas por e-mail | 5 em 15 minutos |
| Duração do bloqueio | 15 minutos |

O mecanismo utiliza scripts Lua para operações atômicas e HMAC-SHA256 para proteger os identificadores armazenados no Redis.

Após uma autenticação bem-sucedida, as falhas associadas ao e-mail são removidas. Caso o Redis fique indisponível, a autenticação não prossegue sem a proteção de rate limiting (fail-closed).

## Estrutura do projeto

```text
public/
├── brand/                    Identidade visual e logotipos (logo-dark.png, logo-light.png)
└── not-found-cat.jpg         Imagem temática da página de erro 404
src/
├── app/
│   ├── (public)/             Páginas públicas e autenticação
│   ├── dashboard/            Área privada
│   ├── actions/              Server Actions de tarefas e conta
│   ├── api/auth/             Integração NextAuth
│   ├── error.tsx             Tratamento global de erros
│   ├── favicon.ico           Ícone do navegador
│   └── not-found.tsx         Página personalizada de erro 404
├── components/               Componentes da interface
├── lib/
│   ├── security/             Utilitários de segurança e criptografia
│   ├── auth.ts               Configuração do NextAuth
│   ├── dashboard-session.ts  Validação de sessão do dashboard
│   ├── date-utils.ts         Formatação e manipulação de datas
│   ├── db.ts                 Conexão Singleton com MongoDB
│   ├── rate-limit.ts         Proteção de tentativas com Upstash Redis
│   ├── task-utils.ts         Funções auxiliares de tarefas
│   ├── task-validation.ts    Regras de validação de tarefas
│   └── utils.ts              Utilitários gerais da interface
├── models/
│   ├── EmailVerificationToken.ts  Modelo de token para verificação de e-mail
│   ├── PasswordResetToken.ts      Modelo de token para redefinição de senha
│   ├── Task.ts                    Modelo Mongoose de tarefas
│   └── User.ts                    Modelo Mongoose de usuários
├── store/
│   ├── task-ui-provider.tsx  Provedor de estado da interface
│   └── task-ui-store.ts      Estado global com Zustand
└── types/
    ├── task.ts               Tipos e contratos de tarefas
    └── types-next-auth.d.ts  Tipagens estendidas do NextAuth
docs/                         Documentação técnica e contratos
```[cite: 3, 4]
```

## Identidade visual

A identidade visual utiliza uma paleta minimalista composta por:

| Cor | Código |
|---|---|
| Preto | `#080808` |
| Prata | `#CDCBCA` |
| Vermelho | `#D41514` |
| Branco | `#FFFFFF` |

A interface utiliza tipografia Geist, temas claro e escuro e componentes com tokens semânticos.

## Instalação e configuração

### Requisitos

- Node.js 20.19 ou superior.
- npm.
- Conta e instância MongoDB Atlas.
- Instância Upstash Redis.

A homologação do projeto utilizou Node.js 24.

### 1. Clonar o repositório

```bash
git clone https://github.com/EmillyDelf/DistrictTASK.git
cd DistrictTASK
```

### 2. Instalar dependências

```bash
npm ci
```

### 3. Configurar as variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto, utilizando `.env.example` como referência.

| Variável | Finalidade |
|---|---|
| `MONGODB_URI` | URI de conexão com MongoDB Atlas. |
| `NEXTAUTH_URL` | Endereço da aplicação. |
| `NEXTAUTH_SECRET` | Segredo utilizado pelo NextAuth para proteger as sessões. |
| `UPSTASH_REDIS_REST_URL` | URL REST da instância Redis. |
| `UPSTASH_REDIS_REST_TOKEN` | Token de acesso ao Upstash Redis. |
| `RATE_LIMIT_HASH_SECRET` | Segredo independente utilizado na geração de identificadores HMAC. |

Gere os segredos com o comando abaixo, executando-o duas vezes para obter valores diferentes:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Configure um resultado em `NEXTAUTH_SECRET` e o outro em `RATE_LIMIT_HASH_SECRET`.

As credenciais do MongoDB Atlas e do Upstash devem ser obtidas nos respectivos painéis dos serviços.

**Importante:** mantenha as credenciais reais exclusivamente no `.env.local`. Nunca publique tokens, senhas ou segredos no GitHub. O `.env.example` deve conter apenas valores ilustrativos.

### 4. Executar a aplicação

No Windows PowerShell:

```powershell
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000 --webpack
```

Em macOS ou Linux:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000 --webpack
```

Acesse:

http://localhost:3000

## Verificação e build

| Comando | Finalidade |
|---|---|
| `npm run lint` | Verificação de código com ESLint. |
| `npx tsc --noEmit` | Verificação de tipos TypeScript. |
| `npm run build` | Compilação para produção. |
| `npm run build -- --webpack` | Compilação utilizando Webpack. |
| `npm run start` | Execução da aplicação compilada. |

Na homologação em Windows, foi identificada uma falha de comunicação entre o Turbopack e o subprocesso Node utilizado pelo PostCSS. A compilação com Webpack foi validada como alternativa.

## Homologação e publicação

A validação funcional contempla:

- Cadastro e autenticação de usuários.
- Criação, edição, conclusão e exclusão de tarefas.
- Pesquisa, filtros e ordenação.
- Alternância entre temas.
- Persistência dos dados após recarregar a aplicação.
- Isolamento das tarefas entre contas diferentes.
- Bloqueio temporário após excesso de tentativas de login.

A publicação em produção requer a configuração de serviços próprios para MongoDB Atlas e Upstash Redis, além da utilização de segredos exclusivos para o ambiente de produção.

O deploy planejado utiliza Vercel com o preset Next.js e Node.js 24.x. Antes da disponibilização pública, devem ser avaliados os alertas de dependências identificados na auditoria do projeto e realizadas as validações de autenticação, persistência, rate limiting e isolamento de dados no ambiente publicado.

## Desenvolvedores

- [EmillyDelf](https://github.com/EmillyDelf)
- [JohnHarrison-br](https://github.com/JohnHarrison-br)

---

**District Task** — Organização individual de tarefas.

Projeto acadêmico desenvolvido para fins de estudo e aprendizado em desenvolvimento web fullstack.
