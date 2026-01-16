import { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 font-semibold',
        success: 'bg-gradient-to-r from-green to-emerald text-white font-semibold shadow-sm',
        warning: 'bg-gradient-to-r from-yellow to-orange text-white font-semibold shadow-sm',
        danger: 'bg-gradient-to-r from-red to-pink text-white font-semibold shadow-sm',
        info: 'bg-gradient-to-r from-blue to-cyan text-white font-semibold shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
