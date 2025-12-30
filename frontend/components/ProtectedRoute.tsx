'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, isSuperAdmin, getUser } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
  allowBbuFinance?: boolean; // bbu-finance için sadece ana sayfa
}

export default function ProtectedRoute({ children, requireSuperAdmin = false, allowBbuFinance = false }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Login sayfası için kontrol yapma
    if (pathname === '/login') {
      if (isAuthenticated()) {
        router.push('/');
      } else {
        setLoading(false);
        setIsAuthorized(true);
      }
      return;
    }

    // Tüm sayfalar için authentication kontrolü
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const user = getUser();
    
    // bbu-finance kullanıcısı için sadece ana sayfaya izin ver
    if (user?.role === 'bbu-finance' && pathname !== '/') {
      router.push('/');
      return;
    }

    // Superadmin gerektiren sayfalar için kontrol
    if (requireSuperAdmin && !isSuperAdmin()) {
      router.push('/');
      return;
    }

    // allowBbuFinance=false ise ve bbu-finance kullanıcısıysa, sadece ana sayfaya izin ver
    if (!allowBbuFinance && user?.role === 'bbu-finance' && pathname !== '/') {
      router.push('/');
      return;
    }

    setLoading(false);
    setIsAuthorized(true);
  }, [pathname, router, requireSuperAdmin, allowBbuFinance]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

