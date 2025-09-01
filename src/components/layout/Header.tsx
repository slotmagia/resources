'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '首页', href: '/' },
  { name: '资源', href: '/resources' },
  { name: '视频', href: '/resources?type=video' },
  { name: '软件', href: '/resources?type=software' },
  { name: '文档', href: '/resources?type=document' },
  { name: '文章', href: '/resources?type=article' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">资</span>
            </div>
            <span className="font-bold text-xl">资源吧</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索资源..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart">
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8L3 21h18M9 19a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>
            </Link>

            {/* User Avatar / Login */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  注册
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden border-t",
          isMenuOpen ? "block" : "hidden"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <div className="space-y-2">
                <Link href="/login">
                  <Button variant="outline" fullWidth>
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button fullWidth>
                    注册
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
