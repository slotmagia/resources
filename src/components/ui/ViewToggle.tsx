'use client';

import { cn } from '@/lib/utils';

interface ViewToggleProps {
  value: 'grid' | 'list';
  onChange: (value: 'grid' | 'list') => void;
  className?: string;
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn('flex items-center rounded-lg border border-gray-200 p-1', className)}>
      <button
        onClick={() => onChange('grid')}
        className={cn(
          'flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
          value === 'grid'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        )}
        title="网格视图"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
          />
        </svg>
        <span className="ml-1 hidden sm:inline">网格</span>
      </button>
      
      <button
        onClick={() => onChange('list')}
        className={cn(
          'flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
          value === 'list'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        )}
        title="列表视图"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 10h16M4 14h16M4 18h16" 
          />
        </svg>
        <span className="ml-1 hidden sm:inline">列表</span>
      </button>
    </div>
  );
}
