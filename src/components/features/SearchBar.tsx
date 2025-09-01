'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { cn, debounce } from '@/lib/utils';
import { Input } from '@/components/ui';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'keyword' | 'category' | 'author';
}

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  className?: string;
}

// 模拟搜索建议
const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'React教程', type: 'keyword' },
  { id: '2', text: 'Vue.js', type: 'keyword' },
  { id: '3', text: 'TypeScript', type: 'keyword' },
  { id: '4', text: 'Node.js', type: 'keyword' },
  { id: '5', text: 'Photoshop', type: 'keyword' },
  { id: '6', text: '前端开发', type: 'category' },
  { id: '7', text: '图像处理', type: 'category' },
  { id: '8', text: '张老师', type: 'author' },
];

export function SearchBar({ 
  value, 
  onSearch, 
  placeholder = '搜索资源...', 
  suggestions = mockSuggestions,
  className 
}: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useMemo(() => debounce((searchQuery: string) => {
    onSearch(searchQuery);
  }, 300), [onSearch]);

  // 同步外部value到内部state
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [query, suggestions]);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSearch(suggestion.text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else {
          setShowSuggestions(false);
          onSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch('');
    inputRef.current?.focus();
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      keyword: '关键词',
      category: '分类',
      author: '作者'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword':
        return (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'category':
        return (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'author':
        return (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          leftIcon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          rightIcon={query && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
        />
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                'w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors',
                index === selectedIndex && 'bg-blue-50'
              )}
            >
              <div className="flex items-center space-x-2">
                <div className="text-gray-400">
                  {getTypeIcon(suggestion.type)}
                </div>
                <span className="text-gray-900">{suggestion.text}</span>
              </div>
              <span className="text-xs text-gray-400">
                {getTypeLabel(suggestion.type)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
