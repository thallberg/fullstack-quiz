import { cn } from '@/lib/utils';
import { useContent } from '@/contexts/LocaleContext';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const { LOADING_TEXT } = useContent();
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-solid border-t-transparent border-r-transparent border-b-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={LOADING_TEXT.ariaLabel}
    >
      <span className="sr-only">{LOADING_TEXT.srOnly}</span>
    </div>
  );
}
