'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardBody, CardHeader } from './Card';

interface CollapsibleProps {
  title: string | ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  icon?: ReactNode;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  icon,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={cn('overflow-hidden w-full', className)}>
      <CardHeader
        className={cn(
          'cursor-pointer select-none transition-colors hover:bg-gray-50 w-full !py-2 !px-3 sm:!py-2.5 sm:!px-4',
          headerClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {icon && <div className="shrink-0">{icon}</div>}
            <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
          </div>
          <svg
            className={cn(
              'h-5 w-5 text-white transition-transform duration-200 shrink-0',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </CardHeader>
      {isOpen && (
        <div className="transition-all duration-300 ease-in-out w-full">
          <CardBody className="p-0 w-full">
            <div className="p-2 sm:p-4 lg:p-6 w-full">{children}</div>
          </CardBody>
        </div>
      )}
    </Card>
  );
}
