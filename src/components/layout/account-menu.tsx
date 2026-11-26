"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { PendingButton } from "@/components/feedback/pending-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountMenu({ name, initials }: { name: string; initials: string }) {
  const [pending, setPending] = useState(false);
  const leaving = useRef(false);

  async function leave() {
    if (leaving.current) return;
    leaving.current = true;
    setPending(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch {
      leaving.current = false;
      setPending(false);
      toast.error("Não foi possível sair. Tente novamente.");
    }
  }

  return (
    <>
      <div className="hidden min-w-0 items-center gap-3 sm:flex">
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border bg-secondary text-label-md">
          {initials}
        </span>
        <span className="max-w-28 truncate text-label-lg md:max-w-40" title={name}>{name}</span>
        <PendingButton type="button" variant="outline" size="sm" onClick={leave} pending={pending} pendingLabel="Saindo...">
          <LogOut aria-hidden="true" /> Sair
        </PendingButton>
      </div>
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" size="icon" variant="secondary" aria-label="Menu da conta" className="rounded-full border">
              <span aria-hidden="true">{initials}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="wrap-anywhere">{name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={pending} onSelect={(event) => {
              event.preventDefault();
              void leave();
            }}>
              <LogOut aria-hidden="true" /> {pending ? "Saindo..." : "Sair"}
            </DropdownMenuItem>
            {pending && <span role="status" className="sr-only">Encerrando a sessão</span>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
