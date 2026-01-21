import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-indigo)] text-white [a&]:hover:from-[var(--color-blue)] [a&]:hover:to-[var(--color-indigo)] shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        info:
          "border-transparent bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-cyan)] text-white [a&]:hover:from-[var(--color-blue)] [a&]:hover:to-[var(--color-cyan)] shadow-sm",
        success:
          "border-transparent bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white [a&]:hover:from-[var(--color-green)] [a&]:hover:to-[var(--color-emerald)] shadow-sm",
        warning:
          "border-transparent bg-gradient-to-r from-[var(--color-yellow)] to-[var(--color-orange)] text-white [a&]:hover:from-[var(--color-yellow)] [a&]:hover:to-[var(--color-orange)] shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
