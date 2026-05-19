'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, sidebarCollapsed } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Allow demo access without strict auth check for demonstration
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      <Header />
      <main
        className="min-h-screen transition-all duration-300"
        style={{ 
          paddingTop: '80px', 
          marginLeft: sidebarCollapsed ? 72 : 260,
          background: '#0a0a0f'
        }}
      >
        <div style={{ padding: '24px' }} className="space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
