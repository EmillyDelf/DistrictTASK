"use client";

import { DropdownMenu as MenuPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;

export function DropdownMenuContent({ className, sideOffset = 6, collisionPadding = 12, ...props }: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("z-50 min-w-40 max-w-[calc(100vw_-_1.5rem)] max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, variant = "default", ...props }: ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn("flex min-h-11 cursor-default select-none items-center gap-2 rounded-sm px-3 py-2 text-label-lg outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-hover [&>svg]:size-4", variant === "destructive" && "text-destructive-text focus:bg-danger-surface focus:text-danger-foreground", className)}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label data-slot="dropdown-menu-label" className={cn("px-3 py-2 text-label-md text-muted-foreground", className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("my-1 h-px bg-divider", className)} {...props} />;
}
