"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";

import { Feedback } from "@/components/feedback/feedback";
import { FieldMessage } from "@/components/ui/field-message";

const subscribe = () => () => {};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Record<string, string>;

type Submission = {
  validate: (values: FormData) => FieldErrors;
  send: (values: FormData) => Promise<string | null>;
  failureMessage: string;
};

type FormState = {
  ready: boolean;
  pending: boolean;
  errors: FieldErrors;
};

export function validateEmail(email: string) {
  if (!email) return "Informe seu e-mail.";
  return email.length > 254 || !emailPattern.test(email) ? "Informe um endereço de e-mail válido." : "";
}

export function AuthForm({
  children,
  validate,
  send,
  failureMessage,
}: Submission & { children: (state: FormState) => ReactNode }) {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || submitting.current) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    setFeedback("");

    const firstInvalid = Object.keys(fieldErrors)[0];
    if (firstInvalid) {
      const field = form.elements.namedItem(firstInvalid);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    submitting.current = true;
    setPending(true);

    try {
      const error = await send(values);
      // On success keep the controls disabled until the next page replaces this form.
      if (error === null) return;
      setFeedback(error);
    } catch {
      setFeedback(failureMessage);
    }

    submitting.current = false;
    setPending(false);
  }

  return (
    <form method="post" onSubmit={handleSubmit} noValidate className="space-y-4">
      {!ready && (
        <FieldMessage role="status">
          Aguarde o carregamento do formulário. Se o JavaScript estiver desativado, ative-o e recarregue a página.
        </FieldMessage>
      )}
      {feedback && <Feedback variant="error">{feedback}</Feedback>}
      {/* Disabled and unnamed controls keep credentials out of native submissions before hydration. */}
      <fieldset disabled={!ready || pending} className="min-w-0 space-y-4">
        {children({ ready, pending, errors })}
      </fieldset>
    </form>
  );
}
