"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Tema claro", icon: Sun, activeClass: "bg-card text-foreground ring-1 ring-border ring-inset after:block dark:bg-transparent dark:text-muted-foreground dark:ring-0 dark:after:hidden" },
  { value: "dark", label: "Tema escuro", icon: Moon, activeClass: "after:hidden dark:bg-active dark:text-primary-text dark:ring-1 dark:ring-input dark:ring-inset dark:after:block" },
] as const;

const subscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Tema da interface"
      className={cn("inline-flex gap-1 rounded-md border bg-secondary p-1", className)}
    >
      {themes.map(({ value, label, icon: Icon, activeClass }) => (
        <Button
          key={value}
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          aria-pressed={mounted ? resolvedTheme === value : undefined}
          className={cn("relative text-muted-foreground hover:text-foreground after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-ring", activeClass)}
          onClick={() => setTheme(value)}
        >
          <Icon aria-hidden="true" strokeWidth={1.75} />
        </Button>
      ))}
    </div>
  );
}
