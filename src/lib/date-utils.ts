import type { TaskStatus } from "@/types/task";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

// Prazos representam dias de calendário. A edição deve enviar AAAA-MM-DD
// (meia-noite UTC no backend) e usar o mesmo dia ao preencher o campo.
export function dueCalendarDay(dueDate: string | null) {
  return dueDate?.split("T", 1)[0] ?? null;
}

export function localCalendarDay(date: Date) {
  const calendar = new Date(0);
  calendar.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  return calendar.toISOString().split("T", 1)[0];
}

export function calendarTimestamp(day: string) {
  return Date.parse(`${day}T00:00:00Z`);
}

export function describeDueDay(day: string, status: TaskStatus, today: string | null) {
  const timestamp = calendarTimestamp(day);
  const parts = dateFormatter.formatToParts(timestamp);
  const short = parts.filter(({ type }) => type === "day" || type === "month").map(({ value }) => value).join(" ");
  const year = day.slice(0, -6);
  const label = today && !today.startsWith(`${year}-`) ? `${short} ${Number(year)}` : short;
  const overdue = today !== null && timestamp < calendarTimestamp(today) && status === "pendente";

  return {
    label: day === today ? `Hoje · ${label}` : overdue ? `Atrasada · ${label}` : label,
    overdue,
  };
}
