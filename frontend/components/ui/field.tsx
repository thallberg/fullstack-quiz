"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-6", className)}
      {...props}
    />
  )
})
FieldGroup.displayName = "FieldGroup"

export const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical"
  }
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        orientation === "horizontal"
          ? "flex items-center gap-4"
          : "space-y-2",
        className
      )}
      {...props}
    />
  )
})
Field.displayName = "Field"

export const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
})
FieldLabel.displayName = "FieldLabel"

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FieldDescription.displayName = "FieldDescription"

type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement> & {
  errors?: any
}

export const FieldError = React.forwardRef<
  HTMLParagraphElement,
  FieldErrorProps
>(({ className, errors, ...props }, ref) => {
  if (!errors || (Array.isArray(errors) && errors.length === 0)) {
    return null
  }

  // Handle Zod errors (StandardSchemaV1Issue objects)
  let errorMessage = '';
  if (Array.isArray(errors)) {
    const firstError = errors[0];
    if (typeof firstError === 'string') {
      errorMessage = firstError;
    } else if (firstError && typeof firstError === 'object' && 'message' in firstError) {
      errorMessage = String(firstError.message);
    } else {
      errorMessage = String(firstError);
    }
  } else if (typeof errors === 'string') {
    errorMessage = errors;
  } else {
    errorMessage = String(errors);
  }

  if (!errorMessage) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-[var(--color-red)]", className)}
      {...props}
    >
      {errorMessage}
    </p>
  )
})
FieldError.displayName = "FieldError"
