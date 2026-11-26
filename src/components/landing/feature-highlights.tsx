import { ClipboardList, Flag, ListChecks } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: ClipboardList, title: "Organize suas atividades", description: "Crie, edite e acompanhe suas tarefas em um único lugar." },
  { icon: Flag, title: "Defina suas prioridades", description: "Identifique o que precisa de atenção e acompanhe seus prazos." },
  { icon: ListChecks, title: "Acompanhe seu progresso", description: "Visualize suas tarefas pendentes e concluídas de forma simples." },
];

export function FeatureHighlights() {
  return (
    <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
      {benefits.map(({ icon: Icon, title, description }) => (
        <li key={title} className="flex">
          <Card className="w-full">
            <CardContent className="flex flex-col gap-3">
              <div className="grid size-10 place-items-center rounded-control bg-secondary text-primary-text">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </div>
              <div className="space-y-1">
                <h2 className="text-title-lg">{title}</h2>
                <p className="text-pretty text-body-md text-muted-foreground">{description}</p>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
