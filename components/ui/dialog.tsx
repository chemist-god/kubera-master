"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react"
import { Slot } from "radix-ui"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Dialog = DialogPrimitive.Root

function DialogTrigger({
  className,
  asChild = false,
  ...props
}: DialogPrimitive.Trigger.Props & { asChild?: boolean }) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      render={asChild ? <Slot.Root /> : undefined}
      className={cn(className)}
      {...props}
    />
  )
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/70 supports-backdrop-filter:backdrop-blur-sm",
        "data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0 duration-200",
        className
      )}
      {...props}
    />
  )
}

function DialogClose({
  className,
  asChild = false,
  ...props
}: DialogPrimitive.Close.Props & { asChild?: boolean }) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      render={asChild ? <Slot.Root /> : undefined}
      className={cn(className)}
      {...props}
    />
  )
}

function DialogContent({
  className,
  showClose = true,
  ...props
}: DialogPrimitive.Popup.Props & { showClose?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Viewport
        data-slot="dialog-viewport"
        className={cn(
          "fixed inset-0 z-50 grid place-items-center p-4 sm:p-6",
          "data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0 duration-200",
          "overflow-y-auto"
        )}
      >
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            "relative w-full outline-none",
            "bg-popover text-popover-foreground ring-foreground/10 ring-1 shadow-2xl",
            "rounded-4xl",
            "data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0",
            "data-closed:zoom-out-95 data-open:zoom-in-95",
            "duration-200 origin-center",
            className
          )}
          {...props}
        >
          {showClose && (
            <DialogClose
              aria-label="Close"
              className="absolute right-4 top-4"
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-3xl bg-background/40 hover:bg-background/60 backdrop-blur-sm border border-border/60"
                />
              }
            >
              <X className="size-4" />
            </DialogClose>
          )}
          {props.children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPortal>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-tight", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
      {...props}
    />
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
}

