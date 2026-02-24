import { cn } from '@/lib/utils';

interface BinaryToggleOption {
  label: string;
  value: boolean;
  activeClass: string;
  inactiveClass: string;
}

interface BinaryToggleProps {
  value: boolean;
  options: readonly BinaryToggleOption[];
  onChange: (value: boolean) => void;
}

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