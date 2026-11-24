
/*
 * Tipos compartilhados do domínio de tarefas.
 * Este arquivo não depende de componentes ou modelos do banco.
 */

// TIPOS DE DOMÍNIO


export type TaskStatus = "pendente" | "completa";

export type TaskPriority = "baixa" | "média" | "alta";

// DADOS DE ENTRADA

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  taskId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

// DADOS DE SAÍDA

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

// RESULTADOS DAS OPERAÇÕES


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
