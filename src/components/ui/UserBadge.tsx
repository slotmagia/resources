import React from 'react';

interface UserBadgeProps {
  vipLevel?: 'premium' | 'basic' | 'none' | string;
  verified?: boolean;
  className?: string;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ 
  vipLevel = 'none', 
  verified = false, 
  className = '' 
}) => {
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'basic':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  const getBadgeText = (level: string) => {
    switch (level) {
      case 'premium':
        return 'VIP';
      case 'basic':
        return '会员';
      default:
        return '普通';
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {/* VIP等级徽章 */}
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeStyle(vipLevel)}`}
      >
        {getBadgeText(vipLevel)}
      </span>
      
      {/* 认证徽章 */}
      {verified && (
        <span className="inline-flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </div>
  );
};
