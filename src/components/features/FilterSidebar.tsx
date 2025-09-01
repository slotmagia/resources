'use client';

import { useState } from 'react';
import { Card, Button, Select, Checkbox, Slider } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { ResourceFilters, ResourceType } from '@/types';

interface FilterSidebarProps {
  filters: ResourceFilters;
  onChange: (filters: Partial<ResourceFilters>) => void;
  onReset?: () => void;
}

const categories = [
  { value: '', label: '全部分类' },
  { value: '前端开发', label: '前端开发' },
  { value: '后端开发', label: '后端开发' },
  { value: '移动开发', label: '移动开发' },
  { value: '图像处理', label: '图像处理' },
  { value: '办公软件', label: '办公软件' },
  { value: '编程教程', label: '编程教程' },
  { value: '职业发展', label: '职业发展' },
];

const resourceTypes: { value: ResourceType; label: string }[] = [
  { value: 'video', label: '视频教程' },
  { value: 'software', label: '软件工具' },
  { value: 'document', label: '技术文档' },
  { value: 'article', label: '精选文章' },
  { value: 'file', label: '文件资源' },
];

const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'popular', label: '最受欢迎' },
  { value: 'price', label: '价格从低到高' },
  { value: 'rating', label: '评分最高' },
];

const ratingOptions = [
  { value: 4.5, label: '4.5星及以上' },
  { value: 4.0, label: '4.0星及以上' },
  { value: 3.5, label: '3.5星及以上' },
  { value: 3.0, label: '3.0星及以上' },
];

export function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    type: true,
    price: true,
    rating: true,
    sort: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category: string) => {
    onChange({ category: category || undefined });
  };

  const handleTypeChange = (type: ResourceType, checked: boolean) => {
    const currentTypes = filters.type || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    onChange({ type: newTypes.length > 0 ? newTypes : undefined });
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    onChange({ priceRange: range });
  };

  const handleRatingChange = (rating: number) => {
    onChange({ rating: rating === filters.rating ? undefined : rating });
  };

  const handleSortChange = (sortBy: string) => {
    onChange({ sortBy: sortBy as 'latest' | 'popular' | 'price' | 'rating' });
  };

  const handleReset = () => {
    onChange({
      category: undefined,
      type: undefined,
      priceRange: undefined,
      rating: undefined,
      sortBy: undefined,
    });
    onReset?.();
  };

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-gray-700 transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${
            expandedSections[section] ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expandedSections[section] && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <Card className="p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">筛选条件</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          重置
        </Button>
      </div>

      <div className="space-y-6">
        {/* 排序 */}
        <FilterSection title="排序方式" section="sort">
          <Select
            options={sortOptions}
            value={filters.sortBy || ''}
            onChange={handleSortChange}
            placeholder="选择排序方式"
          />
        </FilterSection>

        {/* 分类 */}
        <FilterSection title="资源分类" section="category">
          <Select
            options={categories}
            value={filters.category || ''}
            onChange={handleCategoryChange}
            placeholder="选择分类"
          />
        </FilterSection>

        {/* 资源类型 */}
        <FilterSection title="资源类型" section="type">
          <div className="space-y-3">
            {resourceTypes.map((type) => (
              <Checkbox
                key={type.value}
                label={type.label}
                checked={filters.type?.includes(type.value) || false}
                onChange={(e) => handleTypeChange(type.value, e.target.checked)}
              />
            ))}
          </div>
        </FilterSection>

        {/* 价格范围 */}
        <FilterSection title="价格范围" section="price">
          <Slider
            value={filters.priceRange || [0, 1000]}
            min={0}
            max={1000}
            step={10}
            onChange={handlePriceRangeChange}
            formatValue={(value) => value === 0 ? '免费' : formatCurrency(value)}
          />
        </FilterSection>

        {/* 评分 */}
        <FilterSection title="用户评分" section="rating">
          <div className="space-y-3">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleRatingChange(option.value)}
                className={`flex items-center w-full text-left p-2 rounded-lg transition-colors ${
                  filters.rating === option.value
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(option.value)
                          ? 'text-yellow-400 fill-current'
                          : i === Math.floor(option.value) && option.value % 1 !== 0
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* 当前筛选条件摘要 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">当前筛选</h4>
        <div className="space-y-2">
          {filters.category && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">分类:</span>
              <span className="text-gray-900">{filters.category}</span>
            </div>
          )}
          {filters.type && filters.type.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">类型:</span>
              <span className="text-gray-900">{filters.type.length} 项</span>
            </div>
          )}
          {filters.priceRange && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">价格:</span>
              <span className="text-gray-900">
                {filters.priceRange[0] === 0 ? '免费' : formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
              </span>
            </div>
          )}
          {filters.rating && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">评分:</span>
              <span className="text-gray-900">{filters.rating}星+</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
