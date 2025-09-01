'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            className={cn(
              'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
              error && 'border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label 
              htmlFor={checkboxId} 
              className="ml-2 block text-sm text-gray-900 cursor-pointer"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
