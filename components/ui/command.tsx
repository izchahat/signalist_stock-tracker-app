"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SearchIcon, CheckIcon } from "lucide-react"

function Command({
                   className,
                   ...props
                 }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
      <CommandPrimitive
          data-slot="command"
          className={cn(
              "flex size-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground",
              className
          )}
          {...props}
      />
  )
}

function CommandDialog({
                         title = "Command Palette",
                         description = "Search for a command to run...",
                         children,
                         className,
                         showCloseButton = false,
                         ...props
                       }: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
      <Dialog {...props}>
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogContent
            className={cn(
                "overflow-hidden rounded-xl p-0",
                className
            )}
            showCloseButton={showCloseButton}
        >
          {/* ✅ Command wrapper add  — ye fix  hai 'o.subscribe' error */}
          <CommandPrimitive className="flex size-full flex-col overflow-hidden">
            {children}
          </CommandPrimitive>
        </DialogContent>
      </Dialog>
  )
}

function CommandInput({
                        className,
                        ...props
                      }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
      <div data-slot="command-input-wrapper" className="flex items-center px-4 py-3 border-b border-white/10">
        <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-500" />
        <CommandPrimitive.Input
            data-slot="command-input"
            className={cn(
                "flex-1 bg-transparent text-base outline-none placeholder:text-gray-500 text-gray-200 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
      </div>
  )
}

function CommandList({
                       className,
                       ...props
                     }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
      <CommandPrimitive.List
          data-slot="command-list"
          className={cn(
              "scrollbar-hide-default max-h-[500px] overflow-x-hidden overflow-y-auto outline-none",
              className
          )}
          {...props}
      />
  )
}

function CommandEmpty({
                        className,
                        ...props
                      }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
      <CommandPrimitive.Empty
          data-slot="command-empty"
          className={cn("py-10 text-center text-sm text-gray-500", className)}
          {...props}
      />
  )
}

function CommandGroup({
                        className,
                        ...props
                      }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
      <CommandPrimitive.Group
          data-slot="command-group"
          className={cn(
              "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
              className
          )}
          {...props}
      />
  )
}

function CommandSeparator({
                            className,
                            ...props
                          }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
      <CommandPrimitive.Separator
          data-slot="command-separator"
          className={cn("-mx-1 h-px bg-border", className)}
          {...props}
      />
  )
}

function CommandItem({
                       className,
                       children,
                       ...props
                     }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
      <CommandPrimitive.Item
          data-slot="command-item"
          className={cn(
              "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground",
              className
          )}
          {...props}
      >
        {children}
        <CheckIcon className="ml-auto opacity-0 group-data-[checked=true]/command-item:opacity-100" />
      </CommandPrimitive.Item>
  )
}

function CommandShortcut({
                           className,
                           ...props
                         }: React.ComponentProps<"span">) {
  return (
      <span
          data-slot="command-shortcut"
          className={cn(
              "ml-auto text-xs tracking-widest text-muted-foreground",
              className
          )}
          {...props}
      />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}