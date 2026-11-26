"use client";

import { Search } from "lucide-react";
import { useId, type RefObject } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasTaskFilters } from "@/lib/task-utils";
import { useTaskUi } from "@/store/task-ui-provider";
import { TaskFilterSheet } from "./task-filter-sheet";
import { TaskOrderSelect, TaskPriorityFilter, TaskStatusFilter } from "./task-filters";

export function TaskToolbar({ searchRef }: { searchRef: RefObject<HTMLInputElement | null> }) {
  const search = useTaskUi((state) => state.search);
  const setSearch = useTaskUi((state) => state.setSearch);
  const hasFilters = useTaskUi(hasTaskFilters);
  const clearFilters = useTaskUi((state) => state.clearFilters);
  const searchId = useId();

  return (
    <section aria-label="Busca e filtros" className="flex min-w-0 flex-wrap items-center gap-3">
      <div className="relative min-w-0 basis-full lg:min-w-52 lg:flex-1 lg:basis-auto">
        <Label className="sr-only" htmlFor={searchId}>Buscar tarefas</Label>
        <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchRef}
          data-task-search
          id={searchId}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar tarefas..."
          className="ps-10"
        />
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <TaskStatusFilter />
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <TaskPriorityFilter />
          <TaskOrderSelect />
        </div>
        <TaskFilterSheet searchRef={searchRef} />
        {hasFilters && (
          <Button type="button" variant="link" size="sm" onClick={() => {
            clearFilters();
            searchRef.current?.focus();
          }}>Limpar filtros</Button>
        )}
      </div>
    </section>
  );
}
