import { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 font-semibold',
        success: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-sm',
        warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-sm',
        danger: 'bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-sm',
        info: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-semibold shadow-sm',
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
