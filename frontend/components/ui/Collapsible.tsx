'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardBody, CardHeader } from './Card';

interface CollapsibleProps {
  title: string;
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
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader
        className={cn(
          'cursor-pointer select-none transition-colors hover:bg-gray-50',
          headerClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="shrink-0">{icon}</div>}
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <svg
            className={cn(
              'h-6 w-6 text-white transition-transform duration-200',
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
        <div className="transition-all duration-300 ease-in-out">
          <CardBody className="p-0">
            <div className="p-6">{children}</div>
          </CardBody>
        </div>
      )}
    </Card>
  );
}
