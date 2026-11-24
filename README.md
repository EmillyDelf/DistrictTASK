# District Task

Sistema web de gerenciamento individual de tarefas, desenvolvido com Next.js, TypeScript e MongoDB. A aplicação permite que múltiplos usuários mantenham suas próprias tarefas em espaços isolados, sem compartilhamento, equipes ou atribuição de atividades a terceiros.

## Sumário

- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades e estado de implementação](#funcionalidades-e-estado-de-implementação)
- [Domínio e regras de negócio](#domínio-e-regras-de-negócio)
- [Segurança e isolamento de dados](#segurança-e-isolamento-de-dados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Contratos e documentação técnica](#contratos-e-documentação-técnica)
- [Identidade visual](#identidade-visual)
- [Requisitos](#requisitos)
- [Instalação e configuração](#instalação-e-configuração)
- [Comandos disponíveis](#comandos-disponíveis)
- [Validação e testes](#validação-e-testes)
- [Escopo e próximos passos](#escopo-e-próximos-passos)
- [Desenvolvimento](#desenvolvimento)

## Tecnologias

### Aplicação e interface

| Tecnologia | Uso |
|---|---|
| [Next.js 16](https://nextjs.org/) | Framework React, App Router, páginas e execução no servidor. |
| [React 19](https://react.dev/) | Construção das interfaces. |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática. |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilização utilitária. |
| [Lucide React](https://lucide.dev/) | Ícones. |
| [Radix UI Slot](https://www.radix-ui.com/primitives) | Primitivo `Slot` utilizado na composição de componentes. |

### Backend, autenticação e persistência

| Tecnologia | Uso |
|---|---|
| [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) | Operações de cadastro e gerenciamento executadas no servidor. |
| [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | Endpoint de autenticação do NextAuth. |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Banco de dados NoSQL hospedado. |
| [Mongoose](https://mongoosejs.com/) | Schemas, models e comunicação com MongoDB. |
| [NextAuth.js 4](https://next-auth.js.org/) | Autenticação por credenciais e sessões JWT. |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Hash e comparação de senhas. |

### Ferramentas de desenvolvimento

- ESLint 9 — análise estática.
- TypeScript Compiler — verificação de tipos.
- npm — gerenciamento de dependências e scripts.

As versões efetivamente declaradas estão em `package.json` e `package-lock.json`.

## Arquitetura

O District Task utiliza uma arquitetura fullstack dentro de uma única aplicação Next.js. O App Router organiza as páginas e rotas; as Server Actions concentram operações de escrita e leitura executadas no servidor; Mongoose faz a persistência no MongoDB Atlas.

O projeto não possui uma API REST independente para o gerenciamento de tarefas. As operações desse módulo são expostas por Server Actions. O Route Handler existente é destinado à integração do NextAuth.

## Funcionalidades e estado de implementação

### Cadastro de usuários — implementado

O fluxo de cadastro está em `src/app/actions.ts` e contempla:

- recebimento de nome, e-mail e senha por `FormData`;
- validação dos tipos e dos campos;
- remoção de espaços externos do nome e do e-mail;
- normalização do e-mail para minúsculas;
- validação do formato e do tamanho do e-mail;
- limite de 80 caracteres para o nome;
- senha com no mínimo 8 caracteres e limite de 72 bytes para compatibilidade com bcrypt;
- geração de hash com bcrypt antes da persistência;
- verificação de e-mail existente;
- tratamento de duplicidade de chave no MongoDB.

O schema de usuário também define e-mail único e senha não selecionada por padrão nas consultas.

### Autenticação — implementada

- Login com e-mail e senha por NextAuth Credentials Provider.
- Normalização do e-mail durante a autenticação.
- Comparação da senha informada com o hash persistido.
- Estratégia de sessão JWT.
- Identificador do usuário disponível na sessão tipada.
- Logout por meio de `signOut`.
- Página de login personalizada em `/login`.

### Proteção de acesso — implementada parcialmente por página e por operação

- O dashboard consulta a sessão no servidor e redireciona usuários não autenticados para `/login`.
- A página inicial redireciona usuários autenticados para `/dashboard`.
- Cada Server Action de tarefas verifica a sessão antes de executar a operação.
- As operações de tarefas aplicam o identificador do usuário autenticado nas consultas.

**Limite da implementação atual:** não há middleware de proteção global no projeto. A proteção observada está nas páginas e nas próprias operações de servidor. A documentação não deve apresentar isso como uma camada global de middleware.

## Domínio e regras de negócio

O produto foi definido como um gerenciador individual e multiusuário:

- cada conta possui seu próprio conjunto de tarefas;
- não há compartilhamento, equipes ou atribuição de tarefas a outras pessoas;
- o proprietário é determinado pela sessão autenticada;
- o cliente não escolhe nem envia o proprietário da tarefa;
- as consultas de tarefas são limitadas ao usuário autenticado.

## Segurança e isolamento de dados

As medidas identificadas no código incluem:

- hash de senhas com bcrypt;
- senha excluída das consultas Mongoose por padrão;
- autenticação por credenciais;
- sessão JWT;
- validação de sessão em cada operação de tarefa;
- identificação do proprietário no servidor;
- filtros por usuário nas consultas de listagem, atualização e exclusão;
- validação de identificadores antes das operações de atualização e exclusão;
- variáveis de ambiente para URI do banco e segredo do NextAuth.

O frontend não deve ser tratado como mecanismo de autorização. As verificações relevantes precisam permanecer no servidor.

## Estrutura do projeto

Estrutura observada no ZIP analisado:

```text
nextjs-fullstack-main/
├── docs/
│   ├── Contrato_das_server_actions.md
│   └── Contrato_de_intengracao.md
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── task-actions.ts
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── SignOutButton.tsx
│   │   └── ui/
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── models/
│   │   ├── Task.ts
│   │   └── User.ts
│   ├── types/
│   │   └── task.ts
│   └── types-next-auth.d.ts
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## Contratos e documentação técnica

O projeto contém dois documentos complementares:

- **`docs/Contrato_das_server_actions.md`:** descreve as quatro operações, parâmetros, retornos, tipos compartilhados, exemplos de uso e regras de segurança.
- **`docs/Contrato_de_intengracao.md`:** estabelece responsabilidades do backend e frontend, padronização de dados, tratamento de estados e critérios para considerar a integração concluída.

Esses documentos são especificações de integração. A presença deles não significa que todos os critérios descritos já tenham sido validados em conjunto.

## Identidade visual

A identidade visual definida para o District Task utiliza uma proposta minimalista e profissional, com a seguinte paleta:

| Cor | Código hexadecimal |
|---|---|
| Preto | `#080808` |
| Prata | `#CDCBCA` |
| Vermelho | `#D41514` |

**Estado de implementação:** a paleta está documentada como identidade definida, mas não está integralmente aplicada ao frontend desta versão. O CSS global utiliza tokens neutros em OKLCH, enquanto as páginas ainda apresentam classes de cores distintas. A aplicação consistente da paleta deve ocorrer na etapa de consolidação visual.

## Requisitos

- Node.js 20.9 ou superior.
- npm.
- MongoDB Atlas ou outra instância MongoDB compatível.
- Variáveis de ambiente configuradas.

Docker não é requisito da configuração atual. MongoDB Compass pode ser utilizado opcionalmente para inspecionar os registros.

## Instalação e configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/EmillyDelf/DistrictTASK.git
cd DistrictTASK
```

### 2. Instalar dependências

```bash
npm ci
```

### 3. Configurar variáveis de ambiente

Crie `.env.local` na raiz do projeto, usando `.env.example` como referência:

```env

# MONGODB ATLAS
# Substitua pelos dados reais apenas no .env.local
MONGODB_URI="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<nome_do_banco>"

# NEXTAUTH
# Configuração local
NEXTAUTH_URL="http://localhost:3000"

# Gere uma chave aleatória segura para sessões JWT
NEXTAUTH_SECRET="substitua-por-uma-chave-aleatoria-segura"

# UPSTASH REDIS
# Obtenha as credenciais no painel do Upstash
UPSTASH_REDIS_REST_URL="https://seu-banco-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="seu-token-rest-do-upstash"

# RATE LIMITING
# Segredo exclusivo para gerar hashes HMAC dos identificadores
# Gere uma chave aleatória diferente do NEXTAUTH_SECRET
RATE_LIMIT_HASH_SECRET="substitua-por-outro-segredo-aleatorio"
```

Gere um segredo para o NextAuth com:

```bash
openssl rand -base64 32
```

Insira o resultado em `NEXTAUTH_SECRET`.

Substitua os valores de exemplo da URI pelos dados do seu cluster MongoDB Atlas. Nunca utilize credenciais reais no `.env.example`, no README ou em arquivos enviados ao Git.

### 4. Executar em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Comandos disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run lint` | Executa o ESLint. |
| `npx tsc --noEmit` | Verifica os tipos TypeScript sem gerar arquivos. |
| `npm run build` | Gera a compilação de produção. |
| `npm run start` | Inicia a aplicação compilada. |

Não há script de testes automatizados declarado em `package.json` nesta versão.

## Validação e testes

Os comandos de lint, verificação de tipos e build estão disponíveis para validação local. O ZIP analisado não contém relatório de execução que permita afirmar que todos foram executados com sucesso nesta revisão.

A validação funcional do módulo de tarefas deve contemplar:

- [ ] Cadastro com dados válidos.
- [ ] Rejeição de e-mail duplicado.
- [ ] Login e logout.
- [ ] Redirecionamento de visitante ao acessar o dashboard.
- [ ] Criação de tarefa com campos obrigatórios e opcionais.
- [ ] Listagem sem tarefas e com tarefas.
- [ ] Atualização de título, descrição, status, prioridade e vencimento.
- [ ] Remoção da data de vencimento.
- [ ] Exclusão de tarefa.
- [ ] Bloqueio de operações sem sessão.
- [ ] Impossibilidade de consultar, alterar ou excluir tarefa pertencente a outra conta.
- [ ] Integração da interface com os estados de carregamento, sucesso e erro.

## Desenvolvimento

Projeto acadêmico desenvolvido para fins de estudo e aprendizado em desenvolvimento web fullstack, com foco em Next.js, TypeScript, autenticação, modelagem de dados e persistência com MongoDB.

**District Task — Organização individual de tarefas.**
