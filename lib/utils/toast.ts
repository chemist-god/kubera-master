"use client";

import { toast as sonnerToast } from "sonner";

type ToastOptions = Parameters<typeof sonnerToast.error>[1];

const destructiveClassName =
    "border-destructive/40 bg-destructive text-destructive-foreground shadow-lg dark:border-destructive/50";
const destructiveDescriptionClassName = "text-destructive-foreground/90";

const mergeClassName = (base?: string, next?: string) =>
    [base, next].filter(Boolean).join(" ");

const withDestructiveStyles = (options?: ToastOptions) => ({
    ...options,
    className: mergeClassName(destructiveClassName, options?.className),
    descriptionClassName: mergeClassName(
        destructiveDescriptionClassName,
        options?.descriptionClassName
    ),
});

const toastError = (title: string, options?: ToastOptions) =>
    sonnerToast.error(title, withDestructiveStyles(options));

export { sonnerToast as toast, toastError };
