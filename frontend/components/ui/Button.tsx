import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 shadow-md',
        secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500 shadow-md',
        danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 focus:ring-red-500 shadow-md',
        outline: 'border-2 border-blue-400 text-blue-700 hover:bg-blue-50 focus:ring-blue-500 bg-white',
        link: 'bg-transparent text-white hover:text-yellow-200 focus:ring-0 focus:ring-offset-0 focus:outline-none shadow-none',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant,
  size,
  className,
  children,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isDisabled}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && <Spinner size="sm" className="text-current" />}
        {children}
      </span>
    </button>
  );
}
