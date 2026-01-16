import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-blue to-indigo text-white hover:from-blue-dark hover:to-indigo-dark focus:ring-blue shadow-md',
        secondary: 'bg-gradient-to-r from-purple to-pink text-white hover:from-purple-dark hover:to-pink-dark focus:ring-purple shadow-md',
        danger: 'bg-gradient-to-r from-red to-rose text-white hover:from-red-dark hover:to-rose-dark focus:ring-red shadow-md',
        outline: 'border border-blue-border/50 text-blue-text hover:bg-gray-100 focus:ring-blue bg-white',
        link: 'bg-transparent text-white hover:text-yellow focus:ring-0 focus:ring-offset-0 focus:outline-none shadow-none',
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
