"use client";

import { X } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;
export const SheetHeader = DialogHeader;
export const SheetBody = DialogBody;
export const SheetFooter = DialogFooter;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;

const sides = {
  right: "inset-y-0 right-0 w-[min(100%_-_1rem,24rem)] border-l pt-[env(safe-area-inset-top)] pe-[env(safe-area-inset-right)] data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  bottom: "inset-x-0 bottom-0 mx-auto max-h-[calc(100dvh_-_max(1rem,env(safe-area-inset-top)))] w-full max-w-lg rounded-t-lg border-x border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
};

export function SheetContent({ className, children, side = "right", ...props }: ComponentProps<typeof SheetPrimitive.Content> & { side?: keyof typeof sides }) {
  return (
    <SheetPortal>
      <DialogOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden bg-card text-card-foreground shadow-lg outline-none duration-150 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out",
          sides[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Fechar painel"
            className={cn("absolute top-2 right-2", side === "right" && "top-[max(0.5rem,env(safe-area-inset-top))] right-[max(0.5rem,env(safe-area-inset-right))]")}
          >
            <X aria-hidden="true" />
          </Button>
        </SheetClose>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}
