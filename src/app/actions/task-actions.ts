
"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Task, {
  type TaskPriority,
  type TaskStatus,
} from "@/models/Task";

// TIPOS E ESTRUTURAS

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

interface SerializedTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

type CreateTaskResult =
  | {
      success: true;
      task: SerializedTask;
    }
  | {
      error: string;
    };

type GetTasksResult =
  | {
      success: true;
      tasks: SerializedTask[];
    }
  | {
      error: string;
    };

type UpdateTaskResult =
  | {
      success: true;
      task: SerializedTask;
    }
  | {
      error: string;
    };

type DeleteTaskResult =
  | {
      success: true;
      message: string;
    }
  | {
      error: string;
    };

// FUNÇÕES AUXILIARES

const validStatuses: TaskStatus[] = [
  "pendente",
  "completa",
];

const validPriorities: TaskPriority[] = [
  "baixa",
  "média",
  "alta",
];

function isValidDate(value: string): boolean {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function serializeTask(task: {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): SerializedTask {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate
      ? task.dueDate.toISOString()
      : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

// CREATE TASK — CRIAR TAREFA

export async function createTask(
  input: CreateTaskInput,
): Promise<CreateTaskResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: "Você precisa estar autenticado para criar tarefas.",
    };
  }

  if (!input || typeof input !== "object") {
    return {
      error: "Dados da tarefa inválidos.",
    };
  }

  const title =
    typeof input.title === "string"
      ? input.title.trim()
      : "";

  const description =
    typeof input.description === "string"
      ? input.description.trim()
      : "";

  if (!title || title.length > 120) {
    return {
      error: "O título deve ter entre 1 e 120 caracteres.",
    };
  }

  if (description.length > 1000) {
    return {
      error: "A descrição deve ter no máximo 1000 caracteres.",
    };
  }

  if (
    input.status !== undefined &&
    !validStatuses.includes(input.status)
  ) {
    return {
      error: "Status da tarefa inválido.",
    };
  }

  if (
    input.priority !== undefined &&
    !validPriorities.includes(input.priority)
  ) {
    return {
      error: "Prioridade da tarefa inválida.",
    };
  }

  let dueDate: Date | undefined;

  if (input.dueDate !== undefined && input.dueDate !== null && input.dueDate !== "") {
    if (
      typeof input.dueDate !== "string" ||
      !isValidDate(input.dueDate)
    ) {
      return {
        error: "Data de vencimento inválida.",
      };
    }

    dueDate = new Date(input.dueDate);
  }

  try {
    await dbConnect();

    const task = await Task.create({
      title,
      description,
      status: input.status ?? "pendente",
      priority: input.priority ?? "média",
      dueDate,
      user: session.user.id,
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      task: serializeTask(task),
    };
  } catch (error: unknown) {
    console.error("Falha ao criar tarefa:", error);

    return {
      error: "Não foi possível criar a tarefa.",
    };
  }
}

// GET TASKS — LISTAR TAREFAS

export async function getTasks(): Promise<GetTasksResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: "Você precisa estar autenticado para visualizar tarefas.",
    };
  }

  try {
    await dbConnect();

    // Retorna somente as tarefas do usuário autenticado.
    const tasks = await Task.find({
      user: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      tasks: tasks.map((task) =>
        serializeTask({
          ...task,
          _id: task._id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        }),
      ),
    };
  } catch (error: unknown) {
    console.error("Falha ao listar tarefas:", error);

    return {
      error: "Não foi possível carregar as tarefas.",
    };
  }
}

// UPDATE TASK — ATUALIZAR TAREFA

export async function updateTask(
  input: UpdateTaskInput,
): Promise<UpdateTaskResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: "Você precisa estar autenticado para atualizar tarefas.",
    };
  }

  if (!input || typeof input !== "object") {
    return {
      error: "Dados da atualização inválidos.",
    };
  }

  if (
    typeof input.taskId !== "string" ||
    !/^[a-fA-F0-9]{24}$/.test(input.taskId)
  ) {
    return {
      error: "Identificador da tarefa inválido.",
    };
  }

  const updates: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date;
  } = {};

  const unsetFields: Record<string, 1> = {};

  if (input.title !== undefined) {
    if (typeof input.title !== "string") {
      return {
        error: "Título inválido.",
      };
    }

    const title = input.title.trim();

    if (!title || title.length > 120) {
      return {
        error: "O título deve ter entre 1 e 120 caracteres.",
      };
    }

    updates.title = title;
  }

  if (input.description !== undefined) {
    if (typeof input.description !== "string") {
      return {
        error: "Descrição inválida.",
      };
    }

    const description = input.description.trim();

    if (description.length > 1000) {
      return {
        error: "A descrição deve ter no máximo 1000 caracteres.",
      };
    }

    updates.description = description;
  }

  if (input.status !== undefined) {
    if (!validStatuses.includes(input.status)) {
      return {
        error: "Status da tarefa inválido.",
      };
    }

    updates.status = input.status;
  }

  if (input.priority !== undefined) {
    if (!validPriorities.includes(input.priority)) {
      return {
        error: "Prioridade da tarefa inválida.",
      };
    }

    updates.priority = input.priority;
  }

  if (input.dueDate !== undefined) {
    if (input.dueDate === null || input.dueDate === "") {
      // Permite remover a data de vencimento.
      unsetFields.dueDate = 1;
    } else {
      if (
        typeof input.dueDate !== "string" ||
        !isValidDate(input.dueDate)
      ) {
        return {
          error: "Data de vencimento inválida.",
        };
      }

      updates.dueDate = new Date(input.dueDate);
    }
  }

  if (
    Object.keys(updates).length === 0 &&
    Object.keys(unsetFields).length === 0
  ) {
    return {
      error: "Nenhum dado foi informado para atualização.",
    };
  }

  try {
    await dbConnect();

    // A consulta verifica o ID e o proprietário da tarefa.
    const task = await Task.findOneAndUpdate(
      {
        _id: input.taskId,
        user: session.user.id,
      },
      {
        ...(Object.keys(updates).length > 0
          ? { $set: updates }
          : {}),
        ...(Object.keys(unsetFields).length > 0
          ? { $unset: unsetFields }
          : {}),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      return {
        error:
          "Tarefa não encontrada ou você não tem permissão para atualizá-la.",
      };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      task: serializeTask(task),
    };
  } catch (error: unknown) {
    console.error("Falha ao atualizar tarefa:", error);

    return {
      error: "Não foi possível atualizar a tarefa.",
    };
  }
}

// DELETE TASK — EXCLUIR TAREFA

export async function deleteTask(
  taskId: string,
): Promise<DeleteTaskResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: "Você precisa estar autenticado para excluir tarefas.",
    };
  }

  if (
    typeof taskId !== "string" ||
    !/^[a-fA-F0-9]{24}$/.test(taskId)
  ) {
    return {
      error: "Identificador da tarefa inválido.",
    };
  }

  try {
    await dbConnect();

    // Exclui somente se a tarefa pertencer ao usuário autenticado.
    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: session.user.id,
    });

    if (!task) {
      return {
        error:
          "Tarefa não encontrada ou você não tem permissão para excluí-la.",
      };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Tarefa excluída com sucesso.",
    };
  } catch (error: unknown) {
    console.error("Falha ao excluir tarefa:", error);

    return {
      error: "Não foi possível excluir a tarefa.",
    };
  }
}
