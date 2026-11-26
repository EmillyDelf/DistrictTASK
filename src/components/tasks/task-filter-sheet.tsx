"use client";

import { SlidersHorizontal } from "lucide-react";
import { useEffect, type RefObject } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet, SheetBody, SheetClose, SheetContent, SheetDescription,
  SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { hasTaskFilters } from "@/lib/task-utils";
import { useTaskUi } from "@/store/task-ui-provider";
import { TaskOrderSelect, TaskPriorityFilter } from "./task-filters";

const desktopQuery = "(min-width: 48rem)";

export function TaskFilterSheet({ searchRef }: { searchRef: RefObject<HTMLInputElement | null> }) {
  const filtersOpen = useTaskUi((state) => state.filtersOpen);
  const setFiltersOpen = useTaskUi((state) => state.setFiltersOpen);
  const clearFilters = useTaskUi((state) => state.clearFilters);
  const hasFilters = useTaskUi(hasTaskFilters);
  const active = useTaskUi((state) => Number(state.priority !== "all") + Number(state.order !== "recent"));

  useEffect(() => {
    if (!filtersOpen) return;
    const desktop = window.matchMedia(desktopQuery);
    const closeOnDesktop = () => {
      if (desktop.matches) setFiltersOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    closeOnDesktop();
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [filtersOpen, setFiltersOpen]);

  return (
    <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={active ? `Filtros, ${active} opções adicionais ativas` : "Filtros"}
          className="md:hidden"
        >
          <SlidersHorizontal aria-hidden="true" /> Filtros
          {active > 0 && <span aria-hidden="true" className="rounded-full bg-primary px-1.5 text-primary-foreground">{active}</span>}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" onCloseAutoFocus={(event) => {
        if (window.matchMedia(desktopQuery).matches) {
          event.preventDefault();
          searchRef.current?.focus();
        }
      }}>
        <SheetHeader>
          <SheetTitle>Filtros e ordenação</SheetTitle>
          <SheetDescription className="sr-only">As alterações são aplicadas à lista imediatamente.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <TaskPriorityFilter mobile />
          <TaskOrderSelect mobile />
        </SheetBody>
        <SheetFooter className="grid grid-cols-2">
          <Button type="button" variant="outline" disabled={!hasFilters} onClick={clearFilters}>Limpar filtros</Button>
          <SheetClose asChild><Button type="button">Concluir</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
