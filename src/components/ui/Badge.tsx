'use client';

import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const badgeVariants = {
  variant: {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-gray-200 text-gray-900',
    destructive: 'bg-red-600 text-white',
    outline: 'border border-gray-300 bg-transparent text-gray-700',
    success: 'bg-green-600 text-white',
  },
  size: {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  },
};

export function Badge({ 
  className, 
  variant = 'default', 
  size = 'sm',
  ...props 
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    />
  );
}
