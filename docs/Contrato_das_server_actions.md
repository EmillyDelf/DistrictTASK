# Documentação Técnica — Server Actions

## District Task

**Módulo:** Gerenciamento de tarefas  
**Responsável:** Backend  
**Tecnologia:** Next.js Server Actions + TypeScript + MongoDB  
**Arquivo das operações:** `src/app/actions/task-actions.ts`  
**Arquivo dos tipos:** `src/types/task.ts`

---

## 1. Visão geral

O backend do District Task disponibiliza quatro Server Actions responsáveis pelo gerenciamento das tarefas dos usuários autenticados.

As operações disponíveis são:

| Operação | Server Action | Descrição |
|---|---|---|
| CREATE | `createTask` | Cria uma nova tarefa. |
| READ | `getTasks` | Lista as tarefas do usuário autenticado. |
| UPDATE | `updateTask` | Atualiza uma tarefa existente. |
| DELETE | `deleteTask` | Exclui uma tarefa existente. |

As operações são implementadas por meio de Server Actions do Next.js. Portanto, não é necessário criar ou consumir endpoints REST para essas funcionalidades.

## 2. Tipos compartilhados

Os tipos utilizados pelas operações estão centralizados em:

`src/types/task.ts`

### 2.1. Status da tarefa

```ts
export type TaskStatus = "pendente" | "completa";
```

Valores permitidos:

- `pendente`: tarefa ainda não concluída.
- `completa`: tarefa concluída.

### 2.2. Prioridade da tarefa

```ts
export type TaskPriority = "baixa" | "média" | "alta";
```

Valores permitidos:

- `baixa`
- `média`
- `alta`

### 2.3. CreateTaskInput

Interface utilizada para receber os dados de criação de uma tarefa.

```ts
export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}
```

| Campo | Tipo | Obrigatório |
|---|---|---|
| `title` | `string` | Sim |
| `description` | `string` | Não |
| `status` | `TaskStatus` | Não |
| `priority` | `TaskPriority` | Não |
| `dueDate` | `string \| null` | Não |

### 2.4. UpdateTaskInput

Interface utilizada para receber os dados de atualização.

```ts
export interface UpdateTaskInput {
  taskId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}
```

| Campo | Tipo | Obrigatório |
|---|---|---|
| `taskId` | `string` | Sim |
| `title` | `string` | Não |
| `description` | `string` | Não |
| `status` | `TaskStatus` | Não |
| `priority` | `TaskPriority` | Não |
| `dueDate` | `string \| null` | Não |

O campo `taskId` identifica a tarefa que será atualizada. Os demais campos representam os dados que poderão ser modificados.

### 2.5. SerializedTask

Interface que representa uma tarefa serializada para retorno ao frontend.

```ts
export interface SerializedTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
```

As datas são representadas como strings, evitando o envio de objetos Date diretamente ao frontend.

### 2.6. Tipos de retorno

As operações utilizam os seguintes tipos:

```ts
export type CreateTaskResult =
  | { success: true; task: SerializedTask }
  | { error: string };

export type GetTasksResult =
  | { success: true; tasks: SerializedTask[] }
  | { error: string };

export type UpdateTaskResult =
  | { success: true; task: SerializedTask }
  | { error: string };

export type DeleteTaskResult =
  | { success: true; message: string }
  | { error: string };
```

O frontend deverá verificar se o retorno contém `error` antes de acessar os dados de sucesso.

---

## 3. CREATE — Criar tarefa

**Função:** `createTask`

**Assinatura:**

```ts
createTask(input: CreateTaskInput): Promise<CreateTaskResult>
```

**Descrição:**

Responsável por cadastrar uma nova tarefa para o usuário autenticado.

**Parâmetro:**

Recebe um objeto `CreateTaskInput`.

Exemplo:

```ts
{
  title: "Estudar Banco de Dados",
  description: "Revisar modelagem e consultas SQL",
  status: "pendente",
  priority: "alta",
  dueDate: "2026-12-10"
}
```

**Retorno em caso de sucesso:**

```ts
{
  success: true,
  task: {
    id: "identificador-da-tarefa",
    title: "Estudar Banco de Dados",
    description: "Revisar modelagem e consultas SQL",
    status: "pendente",
    priority: "alta",
    dueDate: "2026-12-10T00:00:00.000Z",
    createdAt: "2026-11-24T12:00:00.000Z",
    updatedAt: "2026-11-24T12:00:00.000Z"
  }
}
```

*Os identificadores e horários são ilustrativos.*

**Retorno em caso de erro:**

```ts
{
  error: "Mensagem de erro."
}
```

**Regras:**

- Exige autenticação.
- O usuário proprietário é identificado pela sessão.
- O frontend não deve enviar `userId`.
- A operação associa a tarefa ao usuário autenticado.
- Após a criação, o caminho `/dashboard` é revalidado.

---

## 4. READ — Listar tarefas

**Função:** `getTasks`

**Assinatura:**

```ts
getTasks(): Promise<GetTasksResult>
```

**Descrição:**

Responsável por recuperar as tarefas pertencentes ao usuário autenticado.

**Parâmetros:**

Não recebe parâmetros.

**Retorno em caso de sucesso:**

```ts
{
  success: true,
  tasks: [
    {
      id: "identificador-da-tarefa",
      title: "Estudar Banco de Dados",
      description: "Revisar consultas SQL",
      status: "pendente",
      priority: "alta",
      dueDate: "2026-12-10T00:00:00.000Z",
      createdAt: "2026-11-24T12:00:00.000Z",
      updatedAt: "2026-11-24T12:00:00.000Z"
    }
  ]
}
```

Caso não existam tarefas, a operação deverá retornar uma lista vazia.

```ts
{
  success: true,
  tasks: []
}
```

**Retorno em caso de erro:**

```ts
{
  error: "Mensagem de erro."
}
```

**Regras:**

- Exige autenticação.
- Recupera o identificador do usuário pela sessão.
- Retorna exclusivamente as tarefas pertencentes ao usuário autenticado.
- A listagem utiliza ordenação por data de criação, da mais recente para a mais antiga.

---

## 5. UPDATE — Atualizar tarefa

**Função:** `updateTask`

**Assinatura:**

```ts
updateTask(input: UpdateTaskInput): Promise<UpdateTaskResult>
```

**Descrição:**

Responsável por modificar os dados de uma tarefa existente.

**Parâmetro:**

Recebe um objeto `UpdateTaskInput`, contendo obrigatoriamente o identificador da tarefa e os campos que deverão ser atualizados.

Exemplo:

```ts
{
  taskId: "identificador-da-tarefa",
  title: "Estudar Banco de Dados — Revisão",
  priority: "média",
  status: "completa"
}
```

**Retorno em caso de sucesso:**

```ts
{
  success: true,
  task: {
    id: "identificador-da-tarefa",
    title: "Estudar Banco de Dados — Revisão",
    status: "completa",
    priority: "média",
    dueDate: null,
    createdAt: "2026-11-24T12:00:00.000Z",
    updatedAt: "2026-11-24T14:00:00.000Z"
  }
}
```

*Os valores são ilustrativos.*

**Retorno em caso de erro:**

```ts
{
  error: "Mensagem de erro."
}
```

**Regras:**

- Exige autenticação.
- Recebe o identificador da tarefa por `taskId`.
- Verifica se a tarefa pertence ao usuário autenticado.
- Não permite atualizar tarefas de outros usuários.
- Os campos enviados representam os dados que deverão ser modificados.
- Para remover a data de conclusão, o contrato prevê o envio de `null` ou string vazia (`""`), conforme tratamento implementado no backend.
- Após a atualização, o caminho `/dashboard` é revalidado.

---

## 6. DELETE — Excluir tarefa

**Função:** `deleteTask`

**Assinatura:**

```ts
deleteTask(taskId: string): Promise<DeleteTaskResult>
```

**Descrição:**

Responsável por excluir permanentemente uma tarefa pertencente ao usuário autenticado.

**Parâmetro:**

Recebe o identificador da tarefa como string.

Exemplo:

```ts
"identificador-da-tarefa"
```

**Retorno em caso de sucesso:**

```ts
{
  success: true,
  message: "Tarefa excluída com sucesso."
}
```

**Retorno em caso de erro:**

```ts
{
  error: "Mensagem de erro."
}
```

**Regras:**

- Exige autenticação.
- Verifica se a tarefa pertence ao usuário autenticado.
- Não permite excluir tarefas de outros usuários.
- Após a exclusão, o caminho `/dashboard` é revalidado.

---

## 7. Como importar e utilizar as operações

### 7.1. Importação das Server Actions

As operações podem ser importadas pelo caminho:

```ts
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "@/app/actions/task-actions";
```

### 7.2. Importação dos tipos

Os tipos deverão ser importados separadamente utilizando `import type`:

```ts
import type {
  TaskStatus,
  TaskPriority,
  SerializedTask,
  CreateTaskInput,
  UpdateTaskInput
} from "@/types/task";
```

### 7.3. Exemplo de criação

```ts
const result = await createTask({
  title: "Estudar Python",
  description: "Revisar funções e estruturas de dados",
  priority: "alta"
});

if ("error" in result) {
  console.error(result.error);
} else {
  console.log(result.task);
}
```

### 7.4. Exemplo de listagem

```ts
const result = await getTasks();

if ("error" in result) {
  console.error(result.error);
} else {
  console.log(result.tasks);
}
```

### 7.5. Exemplo de atualização

```ts
const result = await updateTask({
  taskId: "identificador-da-tarefa",
  status: "completa"
});

if ("error" in result) {
  console.error(result.error);
} else {
  console.log(result.task);
}
```

### 7.6. Exemplo de exclusão

```ts
const result = await deleteTask("identificador-da-tarefa");

if ("error" in result) {
  console.error(result.error);
} else {
  console.log(result.message);
}
```

---

## 8. Orientações para integração com o frontend

A desenvolvedora responsável pelo frontend deverá observar os seguintes pontos:

1. Utilizar as Server Actions disponibilizadas pelo backend, evitando duplicar regras de negócio.
2. Importar os tipos compartilhados de `src/types/task.ts`.
3. Não criar estruturas de dados incompatíveis com `SerializedTask`.
4. Não enviar `userId` nas operações de criação, atualização ou exclusão.
5. Verificar os retornos antes de atualizar a interface.
6. Apresentar mensagens adequadas para erros e operações concluídas.
7. Tratar os estados de carregamento durante as operações assíncronas.
8. Não presumir que uma operação foi concluída antes de receber seu resultado.
9. Manter a interface compatível com os valores permitidos de status e prioridade.

## 9. Segurança e isolamento de dados

A segurança das operações é responsabilidade do backend.

O frontend não deve ser considerado uma camada de segurança para impedir acessos indevidos.

As Server Actions devem validar a sessão e aplicar as verificações de propriedade necessárias antes de executar operações sobre os dados.

O identificador do usuário é obtido pela sessão autenticada, e não por dados fornecidos pelo cliente.

---

## 10. Critérios de validação da integração

A integração entre backend e frontend deverá ser validada por meio dos seguintes testes:

- [ ] Criar uma tarefa com os campos obrigatórios.
- [ ] Criar uma tarefa com campos opcionais.
- [ ] Listar as tarefas do usuário autenticado.
- [ ] Listar tarefas quando o usuário ainda não possui registros.
- [ ] Atualizar o título de uma tarefa.
- [ ] Atualizar o status de uma tarefa.
- [ ] Atualizar a prioridade de uma tarefa.
- [ ] Atualizar ou remover a data de conclusão.
- [ ] Excluir uma tarefa.
- [ ] Tratar retornos de erro na interface.
- [ ] Verificar que um usuário não consegue acessar tarefas de outro usuário.
- [ ] Verificar o comportamento de operações sem autenticação.

## 11. Referências dos arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/app/actions/task-actions.ts` | Implementação das quatro Server Actions |
| `src/types/task.ts` | Tipos compartilhados e contratos de entrada e saída |
| `src/models/Task.ts` | Modelo de dados das tarefas |
| `src/models/User.ts` | Modelo de dados dos usuários |
| `src/lib/db.ts` | Conexão com MongoDB |
| `src/lib/auth.ts` | Configuração da autenticação |

---

**Documento:** Contrato técnico das Server Actions  
**Projeto:** District Task  
**Módulo:** Backend — Gerenciamento de tarefas  
**Finalidade:** Orientar o desenvolvimento e a integração do frontend com o backend.