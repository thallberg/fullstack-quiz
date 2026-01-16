import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  text?: string;
}

export function Divider({ text, className, ...props }: DividerProps) {
  if (text) {
    return (
      <div
        className={cn('relative flex items-center my-4', className)}
        {...props}
      >
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">{text}</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
    );
  }

  return (
    <hr className={cn('border-t border-gray-300', className)} {...props} />
  );
}
