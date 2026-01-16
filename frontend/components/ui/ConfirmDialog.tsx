'use client';

import { ReactNode } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Bekräfta',
  cancelText = 'Avbryt',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <Card className={`max-w-md w-full ${variant === 'danger' ? 'border-red-border/50 shadow-2xl' : 'border-blue-border/50 shadow-2xl'}`}>
        <CardHeader className={variant === 'danger' ? 'bg-gradient-to-r from-red to-rose text-white border-red-dark' : 'bg-gradient-to-r from-blue to-indigo text-white border-blue-dark'}>
          <h3 className="text-xl font-bold drop-shadow-md">{title}</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700">{message}</p>
        </CardBody>
        <CardFooter>
          <div className="flex justify-end space-x-3 w-full">
            <Button variant="outline" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
