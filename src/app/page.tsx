'use client';

import { useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout';
import { useResourceStore } from '@/stores';
import { Hero } from '@/components/features/Hero';
import { FeaturedResources } from '@/components/features/FeaturedResources';
import { CategoryNav } from '@/components/features/CategoryNav';
import { Stats } from '@/components/features/Stats';

export default function HomePage() {
  const { resources, loading, fetchResources } = useResourceStore();

  useEffect(() => {
    fetchResources();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainLayout>
      <div className="min-h-screen">
        <Hero />
        <Stats />
        <CategoryNav />
        <FeaturedResources 
          resources={resources.slice(0, 8)} 
          loading={loading} 
        />
      </div>
    </MainLayout>
  );
}
