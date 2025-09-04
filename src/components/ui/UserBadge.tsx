import { User } from '@/types';

interface UserBadgeProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export function UserBadge({ user, size = 'sm' }: UserBadgeProps) {
  const getVipBadge = () => {
    switch (user.vipLevel || user.vip_level) {
      case 'premium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            ⭐ 高级会员
          </span>
        );
      case 'basic':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            💎 基础会员
          </span>
        );
      default:
        return null;
    }
  };

  const getVerifiedBadge = () => {
    if (user.verified) {
      return (
        <span className="inline-flex items-center">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </span>
      );
    }
    return null;
  };

  const sizeClasses = {
    sm: 'space-x-1',
    md: 'space-x-2', 
    lg: 'space-x-3'
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      {getVipBadge()}
      {getVerifiedBadge()}
    </div>
  );
}
