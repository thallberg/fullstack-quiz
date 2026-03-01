import { cn } from '@/lib/utils';
import type { BinaryToggleProps } from './types/newQuestion.types';

export function BinaryToggle({
  value,
  options,
  onChange,
}: BinaryToggleProps) {
  return (
    <div className="flex gap-3">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 text-white font-bold rounded-lg py-2 px-4 transition-all',
              isActive
                ? option.activeClass
                : option.inactiveClass
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}