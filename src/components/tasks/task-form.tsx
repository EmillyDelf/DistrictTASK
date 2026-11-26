"use client";

import { Plus, Save } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";

import { createTask, updateTask } from "@/app/actions/task-actions";
import { Feedback } from "@/components/feedback/feedback";
import { PendingButton } from "@/components/feedback/pending-button";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogBody, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { FieldMessage } from "@/components/ui/field-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  changedTaskFields, isTaskId, taskDescriptionLimit, taskFormValues, taskPriorities,
  taskTitleLimit, validateTaskForm, type TaskField, type TaskFieldErrors,
} from "@/lib/task-validation";
import { useTaskUi, useTaskUiStore } from "@/store/task-ui-provider";
import type { TaskDialog } from "@/store/task-ui-store";
import type { SerializedTask } from "@/types/task";
import { useTaskMutation } from "./use-task-mutation";

export function TaskForm({
  dialog, task, restoreFocus,
}: {
  dialog: TaskDialog;
  task?: SerializedTask;
  restoreFocus: (event: Event) => void;
}) {
  const editing = dialog.kind === "edit";
  const key = dialog.kind === "create" ? "create" : dialog.taskId;
  const [baseline] = useState(task);
  const [values, setValues] = useState(() => taskFormValues(baseline));
  const [errors, setErrors] = useState<TaskFieldErrors>({});
  const [message, setMessage] = useState("");
  const pending = useTaskUi((state) => state.pending.has(key));
  const unconfirmed = useTaskUi((state) => !editing && state.creationUnconfirmed);
  const store = useTaskUiStore();
  const mutate = useTaskMutation();
  const uid = useId();
  const dateRef = useRef<HTMLInputElement>(null);
  const originalDueDate = taskFormValues(baseline).dueDate;
  const legacyDate = originalDueDate !== "" && !/^(?!0000)\d{4}-/.test(originalDueDate);
  const unavailable = editing && (!baseline || !isTaskId(key));
  const stale = editing && !!baseline && baseline.updatedAt !== task?.updatedAt;
  const notice = unconfirmed
    ? "A criação pode ter sido concluída. Confira a lista atualizada antes de enviar a tarefa novamente."
    : unavailable || stale
    ? "A tarefa mudou ou não está disponível. Feche o formulário e abra a versão atual."
    : message;
  const Icon = editing ? Save : Plus;

  function change(field: TaskField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage("");
  }

  function fieldProps(field: TaskField, hint?: string) {
    return {
      id: `${uid}-${field}`,
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": [hint, errors[field] && `${uid}-${field}-error`].filter(Boolean).join(" ") || undefined,
    };
  }

  function fieldError(field: TaskField) {
    return errors[field] && <FieldMessage error id={`${uid}-${field}-error`}>{errors[field]}</FieldMessage>;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const state = store.getState();
    if (state.pending.has(key) || (!editing && state.creationUnconfirmed) || unavailable || stale) return;
    const date = dateRef.current;
    const result = validateTaskForm({ ...values, dueDate: date?.value ?? values.dueDate }, date?.validity.badInput, originalDueDate);
    if (!result.value) {
      setMessage("");
      setErrors(result.errors);
      const first = Object.keys(result.errors)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setErrors({});
    setMessage("");
    const value = result.value;

    if (editing && baseline) {
      const changes = changedTaskFields(baseline, value);
      if (Object.keys(changes).length === 0) {
        setMessage("Altere pelo menos um campo antes de salvar.");
        return;
      }
      void mutate({
        key, dialog, send: () => updateTask({ taskId: key, ...changes }),
        success: "Tarefa atualizada com sucesso!", failure: "Não foi possível salvar as alterações.", onError: setMessage,
      });
    } else {
      void mutate({
        key, dialog, send: () => createTask({ ...value, status: "pendente" }),
        success: "Tarefa criada com sucesso!", failure: "Não foi possível criar a tarefa.", onError: setMessage,
      });
    }
  }

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open && !store.getState().pending.has(key)) store.getState().closeDialog(dialog);
    }}>
      <DialogContent
        showCloseButton={!pending}
        onCloseAutoFocus={restoreFocus}
        onEscapeKeyDown={(event) => { if (store.getState().pending.has(key)) event.preventDefault(); }}
        onPointerDownOutside={(event) => { if (store.getState().pending.has(key)) event.preventDefault(); }}
      >
        <DialogHeader>
          <DialogTitle>{editing ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
          <DialogDescription>{editing ? "Atualize as informações da sua tarefa." : "Adicione uma nova atividade à sua lista de tarefas."}</DialogDescription>
        </DialogHeader>
        <form method="post" onSubmit={onSubmit} noValidate className="flex min-h-0 flex-col">
          <DialogBody>
            {notice && (
              <Feedback variant={unconfirmed || unavailable || stale ? "warning" : "error"}>
                <p>{notice}</p>
                {unconfirmed && <p className="mt-1 text-body-sm">Ao abrir a lista, o rascunho será descartado.</p>}
              </Feedback>
            )}
            <fieldset disabled={pending || unavailable} className="min-w-0 space-y-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <Label htmlFor={`${uid}-title`}>Título <span aria-hidden="true" className="text-destructive-text">*</span></Label>
                  <FieldMessage id={`${uid}-title-count`} className="date-text">{values.title.trim().length}/{taskTitleLimit}</FieldMessage>
                </div>
                <Input
                  {...fieldProps("title", `${uid}-title-count`)}
                  value={values.title}
                  onChange={(event) => change("title", event.target.value)}
                  placeholder="Ex. Revisar material da aula"
                  required
                />
                {fieldError("title")}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <Label htmlFor={`${uid}-description`}>Descrição <span className="text-muted-foreground">(opcional)</span></Label>
                  <FieldMessage id={`${uid}-description-count`} className="date-text">{values.description.trim().length}/{taskDescriptionLimit}</FieldMessage>
                </div>
                <Textarea
                  {...fieldProps("description", `${uid}-description-count`)}
                  value={values.description}
                  onChange={(event) => change("description", event.target.value)}
                  placeholder="Adicione detalhes sobre a tarefa"
                />
                {fieldError("description")}
              </div>
              <div className="grid gap-4 min-[460px]:grid-cols-2">
                <div className="min-w-0 space-y-1.5">
                  <Label htmlFor={`${uid}-priority`}>Prioridade</Label>
                  <Select value={values.priority} onValueChange={(value) => change("priority", value)} disabled={pending || unavailable}>
                    <SelectTrigger {...fieldProps("priority")}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(taskPriorities).map(([value, label]) => <SelectItem value={value} key={value}>{label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {fieldError("priority")}
                </div>
                <div className="min-w-0 space-y-1.5">
                  <Label htmlFor={`${uid}-dueDate`}>Prazo <span className="text-muted-foreground">(opcional)</span></Label>
                  <Input
                    {...fieldProps("dueDate", legacyDate ? undefined : `${uid}-date-hint`)}
                    ref={dateRef}
                    type={legacyDate ? "text" : "date"}
                    lang="pt-BR"
                    value={values.dueDate}
                    onInput={(event) => change("dueDate", event.currentTarget.value)}
                  />
                  {!legacyDate && <FieldMessage id={`${uid}-date-hint`}>Dia, mês e ano.</FieldMessage>}
                  {fieldError("dueDate")}
                  {values.dueDate && (
                    <Button type="button" variant="link" size="sm" className="px-0" onClick={() => {
                      change("dueDate", "");
                      dateRef.current?.focus();
                    }}>Limpar prazo</Button>
                  )}
                </div>
              </div>
            </fieldset>
          </DialogBody>
          <DialogFooter className="grid grid-cols-2 sm:flex">
            <DialogClose asChild><Button type="button" variant="outline" disabled={pending}>Cancelar</Button></DialogClose>
            {unconfirmed ? (
              <Button asChild className="min-w-0 whitespace-normal">
                <a href="/dashboard">Conferir lista</a>
              </Button>
            ) : <PendingButton
              type="submit"
              pending={pending}
              pendingLabel={editing ? "Salvando..." : "Criando tarefa..."}
              disabled={unavailable || stale}
              className="min-w-0 whitespace-normal"
            >
              <Icon aria-hidden="true" /> {editing ? "Salvar alterações" : "Criar tarefa"}
            </PendingButton>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
