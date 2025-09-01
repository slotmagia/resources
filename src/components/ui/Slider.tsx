'use client';

import { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  value?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ 
    className, 
    label, 
    value = [0, 100], 
    min = 0, 
    max = 100, 
    step = 1,
    onChange,
    formatValue 
  }, ref) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const currentValueRef = useRef(value);
    const lastValidValueRef = useRef(value);

    useEffect(() => {
      setInternalValue(value);
      currentValueRef.current = value;
      lastValidValueRef.current = value;
    }, [value]);

    const formatter = formatValue || ((val: number) => val.toString());

    // 计算百分比位置
    const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

    // 根据位置计算值
    const getValue = useCallback((clientX: number) => {
      if (!sliderRef.current) return min;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const rawValue = min + (percentage / 100) * (max - min);
      
      // 根据step调整值
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    }, [min, max, step]);

    const updateValue = useCallback((type: 'min' | 'max', clientX: number) => {
      const newValue = getValue(clientX);
      const currentValue = currentValueRef.current;
      
      let newRange: [number, number];
      if (type === 'min') {
        const newMin = Math.min(newValue, currentValue[1]);
        newRange = [newMin, currentValue[1]];
      } else {
        const newMax = Math.max(newValue, currentValue[0]);
        newRange = [currentValue[0], newMax];
      }
      
      // 立即更新ref和状态
      currentValueRef.current = newRange;
      setInternalValue(newRange);
      
      return newRange;
    }, [getValue]);

    const handleStart = useCallback((type: 'min' | 'max', clientX: number) => {
      setIsDragging(type);
      
      // 立即更新位置，确保同步
      const newRange = updateValue(type, clientX);
      lastValidValueRef.current = newRange;
    }, [updateValue]);

    const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleStart(type, e.clientX);
    };

    const handleTouchStart = (type: 'min' | 'max') => (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      if (touch) {
        handleStart(type, touch.clientX);
      }
    };

    const handleMove = useCallback((clientX: number) => {
      if (!isDragging) return;
      
      // 直接更新，不使用requestAnimationFrame以避免延迟
      const newRange = updateValue(isDragging, clientX);
      lastValidValueRef.current = newRange;
    }, [isDragging, updateValue]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX);
    }, [handleMove]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX);
      }
    }, [handleMove]);

    const handleTrackClick = useCallback((e: React.MouseEvent) => {
      if (isDragging) return; // 如果正在拖拽，忽略点击
      
      e.preventDefault();
      e.stopPropagation();
      
      const clickValue = getValue(e.clientX);
      const currentValue = currentValueRef.current;
      
      // 确定应该移动哪个滑块：选择距离点击位置最近的滑块
      const distanceToMin = Math.abs(clickValue - currentValue[0]);
      const distanceToMax = Math.abs(clickValue - currentValue[1]);
      
      const type = distanceToMin <= distanceToMax ? 'min' : 'max';
      const newRange = updateValue(type, e.clientX);
      
      // 立即触发回调
      onChange?.(newRange);
    }, [isDragging, getValue, updateValue, onChange]);

    const handleEnd = useCallback(() => {
      if (isDragging) {
        // 使用最后的有效值触发回调
        const finalValue = lastValidValueRef.current;
        onChange?.(finalValue);
        setIsDragging(null);
      }
    }, [isDragging, onChange]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
      e.preventDefault();
      handleEnd();
    }, [handleEnd]);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
      e.preventDefault();
      handleEnd();
    }, [handleEnd]);

    useEffect(() => {
      if (isDragging) {
        // 添加鼠标事件
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp, { passive: false });
        
        // 添加触摸事件
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // 防止页面滚动和选择
        document.body.style.userSelect = 'none';
        document.body.style.overflow = 'hidden';
        
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
          
          document.body.style.userSelect = '';
          document.body.style.overflow = '';
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    const handleKeyDown = (type: 'min' | 'max') => (e: React.KeyboardEvent) => {
      let delta = 0;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          delta = -step;
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          delta = step;
          break;
        case 'PageDown':
          delta = -step * 10;
          break;
        case 'PageUp':
          delta = step * 10;
          break;
        case 'Home':
          delta = type === 'min' ? min - internalValue[0] : min - internalValue[1];
          break;
        case 'End':
          delta = type === 'min' ? max - internalValue[0] : max - internalValue[1];
          break;
        default:
          return;
      }
      
      e.preventDefault();
      
      const currentValue = currentValueRef.current;
      let newRange: [number, number];
      
      if (type === 'min') {
        const newMin = Math.max(min, Math.min(currentValue[0] + delta, currentValue[1]));
        newRange = [newMin, currentValue[1]];
      } else {
        const newMax = Math.min(max, Math.max(currentValue[1] + delta, currentValue[0]));
        newRange = [currentValue[0], newMax];
      }
      
      // 同步更新ref和状态
      currentValueRef.current = newRange;
      lastValidValueRef.current = newRange;
      setInternalValue(newRange);
      onChange?.(newRange);
    };

    const handleInputChange = (type: 'min' | 'max') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      const currentValue = currentValueRef.current;
      
      let newRange: [number, number];
      if (type === 'min') {
        const newMin = Math.min(newValue, currentValue[1]);
        newRange = [newMin, currentValue[1]];
      } else {
        const newMax = Math.max(newValue, currentValue[0]);
        newRange = [currentValue[0], newMax];
      }
      
      // 同步更新ref和状态
      currentValueRef.current = newRange;
      lastValidValueRef.current = newRange;
      setInternalValue(newRange);
      onChange?.(newRange);
    };

    // 使用当前实际值来计算百分比，确保视觉同步
    const displayValue = isDragging ? currentValueRef.current : internalValue;
    const minPercentage = getPercentage(displayValue[0]);
    const maxPercentage = getPercentage(displayValue[1]);

    return (
      <div ref={ref} className={cn('w-full', isDragging && 'slider-dragging', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {label}
          </label>
        )}
        
        <div className="space-y-4">
          {/* 显示当前值 */}
          <div className="flex justify-between text-sm font-medium text-gray-900">
            <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
              {formatter(displayValue[0])}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
              {formatter(displayValue[1])}
            </span>
          </div>
          
          {/* 自定义双滑块 */}
          <div className="relative py-4 select-none">
            <div 
              ref={sliderRef}
              className="relative h-2 bg-gray-200 rounded-full cursor-pointer slider-track"
              onClick={handleTrackClick}
            >
              {/* 选中范围的轨道 */}
              <div
                className="absolute h-2 bg-blue-500 rounded-full"
                style={{
                  left: `${minPercentage}%`,
                  width: `${maxPercentage - minPercentage}%`,
                }}
              />
              
              {/* 最小值滑块 */}
              <div
                className={cn(
                  "absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab top-1/2 slider-thumb",
                  isDragging === 'min' ? 'scale-110 shadow-lg cursor-grabbing' : 'hover:scale-105 transition-all',
                  isDragging === 'min' ? '' : 'transition-all'
                )}
                style={{ 
                  left: `${minPercentage}%`, 
                  transform: 'translate(-50%, -50%)',
                  transition: isDragging === 'min' ? 'box-shadow 0.2s ease, transform 0.2s ease' : undefined
                }}
                onMouseDown={(e) => {
                  e.stopPropagation(); // 防止事件冒泡到轨道
                  handleMouseDown('min')(e);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation(); // 防止事件冒泡到轨道
                  handleTouchStart('min')(e);
                }}
                onKeyDown={handleKeyDown('min')}
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={displayValue[0]}
                aria-label="最小价格"
                tabIndex={0}
              />
              
              {/* 最大值滑块 */}
              <div
                className={cn(
                  "absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab top-1/2 slider-thumb",
                  isDragging === 'max' ? 'scale-110 shadow-lg cursor-grabbing' : 'hover:scale-105 transition-all',
                  isDragging === 'max' ? '' : 'transition-all'
                )}
                style={{ 
                  left: `${maxPercentage}%`, 
                  transform: 'translate(-50%, -50%)',
                  transition: isDragging === 'max' ? 'box-shadow 0.2s ease, transform 0.2s ease' : undefined
                }}
                onMouseDown={(e) => {
                  e.stopPropagation(); // 防止事件冒泡到轨道
                  handleMouseDown('max')(e);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation(); // 防止事件冒泡到轨道
                  handleTouchStart('max')(e);
                }}
                onKeyDown={handleKeyDown('max')}
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={displayValue[1]}
                aria-label="最大价格"
                tabIndex={0}
              />
            </div>
          </div>
          
          {/* 数值输入框 */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={displayValue[0]}
                onChange={handleInputChange('min')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="最小值"
              />
            </div>
            <div className="flex items-center justify-center w-8 h-8 text-gray-400 text-sm font-medium">
              至
            </div>
            <div className="flex-1">
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={displayValue[1]}
                onChange={handleInputChange('max')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="最大值"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
