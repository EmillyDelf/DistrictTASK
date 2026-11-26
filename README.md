# District Task

Gerenciador individual de tarefas desenvolvido como projeto acadêmico de Desenvolvimento Web II. Cada conta organiza as próprias atividades em um painel privado. A página inicial apresenta uma demonstração com dados fictícios.

## Funcionalidades

- Cadastro, login e logout com e-mail e senha.
- Criação, listagem, edição, conclusão, reabertura e exclusão de tarefas.
- Pesquisa por título, filtros de status e prioridade, ordenação e indicadores.
- Tarefas com título, descrição opcional, prioridade, status e prazo opcional.
- Temas claro e escuro, lista responsiva e formulários adaptados ao mobile.
- Estados de carregamento, lista vazia, busca sem resultados e erro com nova tentativa.

## Tecnologias e arquitetura

- **Interface** — Next.js 16.4.6 com App Router, React 19.2, TypeScript, Tailwind CSS 4, ShadCN/UI, Radix UI, Lucide, next-themes e Sonner.
- **Estado** — Zustand mantém busca, filtros, ordenação, diálogos e operações pendentes por sessão. A lista e os indicadores são derivados da leitura do servidor.
- **Servidor** — Server Actions executam o cadastro e o CRUD. O Route Handler catch-all do NextAuth 4.24.13 serve o fluxo de credenciais e as sessões JWT.
- **Dados** — MongoDB Atlas com Mongoose e conexão singleton. Upstash Redis limita tentativas de login. bcrypt protege as senhas persistidas.
- **Revalidação** — Escritas confirmadas chamam `revalidatePath("/dashboard")`. Quando a confirmação de uma criação fica incerta, a interface preserva o rascunho e orienta a conferir a lista antes de reenviar.

### Estrutura do projeto

```text
public/brand/        Logos oficiais
src/app/(public)/    Página inicial, login, cadastro e layout público
src/app/dashboard/   Área privada, layout, loading e error
src/app/actions/     Server Actions de tarefas
src/app/actions.ts   Cadastro
src/app/api/auth/    Route Handler do NextAuth
src/components/      Interface, temas, feedback e componentes ShadCN/UI
src/lib/             Conexão, autenticação, rate limiting e utilitários
src/models/          Modelos Mongoose de usuário e tarefa
src/store/           Estado do dashboard com Zustand
src/types/           Contratos TypeScript das tarefas
docs/                Contratos de integração e Server Actions
```

As assinaturas, os retornos e as responsabilidades de integração estão documentados nos [contratos de Server Actions](docs/Contrato_das_server_actions.md) e [de integração](docs/Contrato_de_intengracao.md).

## Identidade visual

A identidade combina preto `#080808`, prata `#CDCBCA`, vermelho `#D41514` e branco `#FFFFFF` com tipografia Geist. Os temas usam tokens semânticos e os indicadores usam rótulos além da cor. Os logos estão em `public/brand/` e são servidos por `next/image`.

## Instalação local

Use Node.js 20.19 ou superior, npm, um banco MongoDB e uma instância Upstash Redis de desenvolvimento. A homologação usou Node.js 24. A primeira compilação pode precisar de acesso às fontes do Google via `next/font`.

```powershell
git clone https://github.com/EmillyDelf/DistrictTASK.git
cd DistrictTASK
npm.cmd ci
Copy-Item .env.example .env.local
```

Em uma instalação já configurada, mantenha o arquivo `.env.local` existente. Nas sessões de desenvolvimento, use serviços separados dos de produção.

| Variável | Origem e finalidade |
|---|---|
| `MONGODB_URI` | URI do MongoDB Atlas com usuário de banco autorizado e o nome do banco no caminho. Codifique os caracteres reservados da senha na URI. |
| `NEXTAUTH_URL` | `http://localhost:3000` no ambiente local. Na Vercel, use a URL HTTPS do ambiente correspondente. |
| `NEXTAUTH_SECRET` | Segredo aleatório para sessões JWT. |
| `UPSTASH_REDIS_REST_URL` | URL REST fornecida pelo Upstash para o Redis do ambiente. |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST fornecido pelo Upstash, com permissão para as operações do limitador. |
| `RATE_LIMIT_HASH_SECRET` | Segredo aleatório independente, usado para derivar identificadores de rate limiting por HMAC. |

Execute o comando abaixo duas vezes para gerar valores diferentes para os dois segredos. Guarde os valores apenas na configuração privada do ambiente.

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Inicie o servidor em loopback e acesse [localhost:3000](http://localhost:3000).

```powershell
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000 --webpack
```

Em macOS ou Linux, use `npm` e `npx` no lugar de `npm.cmd` e `npx.cmd`.

## Comandos de verificação e build

| Comando | Uso |
|---|---|
| `npm.cmd run lint` | Verificação ESLint. |
| `npx.cmd tsc --noEmit` | Verificação TypeScript. Execute após a geração dos tipos do Next.js pelo dev ou pelo build. |
| `npm.cmd run build` | Build padrão com Turbopack. |
| `npm.cmd run build -- --webpack` | Alternativa validada na homologação. |
| `npm.cmd run start` | Servir o build localmente. O login em modo de produção depende da identificação do ambiente Vercel e do IP da requisição. Use o servidor de desenvolvimento para testar o login local. |
| `npm.cmd ls --all --silent` | Verificar a árvore instalada. |
| `npm.cmd audit --json` e `npm.cmd audit --omit=dev --json` | Consultar os alertas da árvore completa e da árvore de produção. |

No Windows da homologação, o Turbopack apresentou falha ao conectar ao subprocesso Node do PostCSS. O build Webpack passou com a mesma aplicação e configuração.

## Segurança e calendário

- **Navegação** — Layout e página do dashboard verificam a sessão no servidor e redirecionam visitantes para `/login`.
- **Operações** — Cada Server Action de tarefas exige sessão. O servidor deriva dela a propriedade dos registros. Listagem, edição e exclusão são restritas ao proprietário.
- **Cadastro e login** — O cadastro normaliza o e-mail, limita a senha a 8 caracteres no mínimo e 72 bytes no máximo e grava hash bcrypt com custo 12. Upstash Redis limita o login por e-mail e IP. Os campos de credenciais ficam desabilitados e sem nome até a hidratação.
- **Validação** — Interface e servidor validam os dados separadamente. As Server Actions rejeitam datas inexistentes, como `2026-02-30` e `1900-02-29`, e aceitam datas reais, como `2000-02-29` e `2028-02-29`. A rejeição de um prazo inválido preserva o registro inteiro.
- **Representação do prazo** — `AAAA-MM-DD` é armazenado à meia-noite UTC. `null` e `""` removem o prazo na edição. Omitir o campo preserva o valor atual. Timestamps ISO válidos preservam o instante na conversão para UTC.

## Homologação e publicação

Para testar localmente, cadastre duas contas de demonstração. Crie tarefas com prazos e prioridades diferentes na primeira, edite, conclua, reabra e exclua uma tarefa, alterne os temas e recarregue a página. Use a segunda conta para conferir o isolamento. O roteiro completo e a matriz de Web II acompanham o relatório de entrega.

A publicação depende da avaliação e resolução dos alertas de produção e da rotação dos valores de desenvolvimento previamente compartilhados. A auditoria registra um alerta crítico agregado em `next-auth@4.24.13` e avisos transitivos para `preact`, `source-map-js` e `uuid`.

Após essa liberação, na Vercel use o preset Next.js, Node.js 24.x, instalação com `npm ci` e teste `npm run build`. Se o subprocesso PostCSS falhar, configure `npm run build -- --webpack`. Prepare MongoDB Atlas, Upstash Redis e segredos próprios de produção. Configure `NEXTAUTH_URL` no domínio real e valide login, rate limiting, CRUD, persistência e isolamento antes da liberação pública.

## Créditos

- Emilly — backend e documentação técnica.
- Equipe de frontend — interface, integração e homologação.
