# District Task

Sistema web de gerenciamento individual de tarefas, desenvolvido para permitir que cada usuário organize e acompanhe suas próprias atividades em um ambiente simples e centralizado.

O District Task adota um modelo de utilização individual e multiusuário: cada conta possui seu próprio espaço de tarefas, sem compartilhamento, equipes ou atribuição de atividades a terceiros.

> **Status do projeto:** base de autenticação e persistência estabilizada. O módulo de gerenciamento de tarefas ainda está em desenvolvimento.

## Tecnologias utilizadas

### Frontend
- [Next.js 16](https://nextjs.org/) — framework React com App Router.
- [React 19](https://react.dev/) — construção das interfaces.
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática.
- [Tailwind CSS 4](https://tailwindcss.com/) — estilização.
- [Lucide React](https://lucide.dev/) — biblioteca de ícones.

### Backend e persistência
- [Next.js Server Actions e Route Handlers](https://nextjs.org/docs) — operações executadas no servidor e rotas da aplicação.
- [MongoDB](https://www.mongodb.com/) — banco de dados NoSQL.
- [Mongoose](https://mongoosejs.com/) — modelagem e comunicação com o MongoDB.
- [NextAuth.js 4](https://next-auth.js.org/) — autenticação e gerenciamento de sessão.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — hash de senhas.

## Funcionalidades implementadas

### Cadastro de usuários
- Cadastro com nome, e-mail e senha.
- Validação dos dados no servidor.
- Normalização do e-mail.
- Verificação de e-mails duplicados.
- Criptografia da senha por hash com bcrypt antes da persistência.

### Autenticação
- Login por e-mail e senha.
- Validação das credenciais.
- Sessão utilizando estratégia JWT com NextAuth.
- Encerramento de sessão (logout).
- Identificador do usuário disponível na sessão tipada.

### Proteção de acesso
- Dashboard protegido por autenticação.
- Redirecionamento de usuários não autenticados para a página de login.
- Redirecionamento de usuários autenticados para o dashboard ao acessar a página inicial.

### Banco de dados
- Conexão com MongoDB por meio do Mongoose.
- Cache de conexão para evitar conexões desnecessárias durante o desenvolvimento.
- Recuperação do estado da conexão após falhas.
- Model de usuário com e-mail único e senha excluída das consultas por padrão.

## Funcionalidades planejadas

O módulo principal do District Task será desenvolvido nas próximas etapas.

- Criação de tarefas.
- Listagem de tarefas do usuário autenticado.
- Edição de tarefas.
- Exclusão de tarefas.
- Marcação de tarefas como concluídas ou pendentes.
- Organização das tarefas em formato de lista.
- Definição de prioridades e prazos, conforme regras de negócio a serem estabelecidas.
- Isolamento dos dados para garantir que cada usuário acesse somente suas próprias tarefas.

## Identidade visual

A identidade visual do District Task foi definida com uma proposta minimalista e profissional.

Paleta de cores principal:

| Cor | Código |
|---|---|
| Vermelho principal | `#9F0B0B` |
| Preto | `#000000` |
| Branco | `#FFFFFF` |
| Vermelho auxiliar | `#CF8585` |
| Cinza auxiliar | `#E6E6E6` |

A aplicação definitiva dessa identidade visual aos componentes e telas ainda está pendente.

## Estrutura do projeto

```text
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── actions.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
├── components/
│   ├── SignOutButton.tsx
│   └── ui/
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── utils.ts
├── models/
│   └── User.ts
└── types-next-auth.d.ts
```

## Requisitos para execução

- Node.js 20.9 ou superior.
- npm.
- Instância MongoDB acessível, como MongoDB Atlas.
- Variáveis de ambiente configuradas.

O Docker não é obrigatório na configuração atual, pois o projeto utiliza MongoDB Atlas como banco de dados hospedado. O MongoDB Compass pode ser utilizado opcionalmente para visualizar e administrar os registros.

## Instalação e configuração

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Acesse a pasta do projeto:

```bash
cd district-task
```

### 2. Instalar as dependências

```bash
npm ci
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto, utilizando `.env.example` como referência.

```env
# Conexão com o MongoDB Atlas (substitua pelos dados reais apenas no .env.local)
MONGODB_URI="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<nome_do_banco>"

# Configuração do NextAuth em ambiente local
NEXTAUTH_URL="http://localhost:3000"

# Gere uma chave secreta aleatória (não coloque o segredo real aqui ein)
NEXTAUTH_SECRET="gere-uma-chave-super-super-mega-premium-secreta-aleatoria-aqui"
```

Para gerar um segredo seguro, utilize:

```bash
openssl rand -base64 32
```

Copie o resultado para `NEXTAUTH_SECRET`.

**Importante:** não compartilhe o arquivo `.env.local` e não envie credenciais ou segredos para o GitHub.

### 4. Executar em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run lint` | Executa a análise estática com ESLint. |
| `npx tsc --noEmit` | Verifica os tipos do TypeScript. |
| `npm run build` | Gera a versão otimizada para produção. |
| `npm run start` | Executa a versão compilada para produção. |

## Validação técnica da base

Na versão estabilizada, foram executadas com sucesso as seguintes verificações:

- `npx tsc --noEmit` — verificação de TypeScript.
- `npm run lint` — análise com ESLint.
- `npm run build` — compilação de produção.

Também foram realizados testes funcionais de cadastro, login, acesso ao dashboard e logout, além da conferência dos registros no MongoDB Atlas e MongoDB Compass.

Esses resultados representam a validação da base atual e não substituem os testes das funcionalidades que serão implementadas posteriormente.

## Escopo do produto

O District Task foi definido com as seguintes características:

- Utilização individual.
- Suporte a múltiplos usuários.
- Dados isolados por conta.
- Gerenciamento de tarefas em formato de lista.
- Interface simples e objetiva.
- Sem funcionalidades de equipes ou colaboração entre usuários.

## Desenvolvimento

O projeto será desenvolvido em etapas, priorizando a implementação e validação do backend antes da integração com as interfaces do frontend.

