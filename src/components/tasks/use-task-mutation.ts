"use client";

import { toast } from "sonner";

import { useTaskUiStore } from "@/store/task-ui-provider";
import type { TaskDialog } from "@/store/task-ui-store";

const authenticationErrors = new Set([
  "Você precisa estar autenticado para criar tarefas.",
  "Você precisa estar autenticado para atualizar tarefas.",
  "Você precisa estar autenticado para excluir tarefas.",
]);
const unavailableErrors = new Set([
  "Tarefa não encontrada ou você não tem permissão para atualizá-la.",
  "Tarefa não encontrada ou você não tem permissão para excluí-la.",
]);
const validationErrors = new Set([
  "O título deve ter entre 1 e 120 caracteres.",
  "A descrição deve ter no máximo 1000 caracteres.",
  "Prioridade da tarefa inválida.",
  "Data de vencimento inválida.",
  "Identificador da tarefa inválido.",
  "Nenhum dado foi informado para atualização.",
]);

type TaskMutation = {
  key: string;
  send: () => Promise<{ success: true } | { error: string }>;
  success: string;
  failure: string;
  onError: (message: string) => void;
  onSuccess?: () => void;
  dialog?: TaskDialog;
};

export function useTaskMutation() {
  const store = useTaskUiStore();

  async function mutate({ key, send, success, failure, onError, onSuccess, dialog }: TaskMutation) {
    const token = store.getState().beginMutation(key);
    if (!token) return;

    const stillCurrent = () => store.getState().pending.get(key) === token;

    function unconfirmed() {
      if (key === "create") store.getState().markCreationUnconfirmed();
      onError("Não foi possível confirmar o resultado. Confira a lista atualizada antes de repetir a operação.");
    }

    try {
      const result = await send().catch(() => null);
      if (!stillCurrent()) return;

      if (!result) {
        unconfirmed();
        return;
      }

      if ("error" in result) {
        if (authenticationErrors.has(result.error)) {
          store.getState().expireSession();
          window.location.replace("/login");
        } else if (unavailableErrors.has(result.error)) {
          onError("A tarefa não está disponível. Ela pode ter sido removida ou você pode ter perdido o acesso.");
        } else if (validationErrors.has(result.error)) {
          onError(result.error);
        } else if (key === "create") {
          unconfirmed();
        } else {
          onError(failure);
        }
        return;
      }

      if (result.success === true) {
        onSuccess?.();
        if (dialog) store.getState().closeDialog(dialog);
        toast.success(success);
      } else {
        onError(failure);
      }
    } finally {
      store.getState().finishMutation(key, token);
    }
  }

  return mutate;
}
