/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { user, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <nav className="w-full border-b backdrop-blur-sm sticky top-0 z-50" style={{ backgroundColor: '#28536B', borderColor: '#28536B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-white">
              Portfolio Generator
            </Link>
            <div className="animate-pulse bg-white/20 h-8 w-20 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b backdrop-blur-sm sticky top-0 z-50" style={{ backgroundColor: '#28536B', borderColor: '#28536B' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-white hover:text-white/80 transition-colors">
            Portfolio Generator
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  {user.picture && (
                    <Image
                      src={user.picture}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-white/90 hidden sm:inline">
                    {user.name || user.email}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  Dashboard
                </Link>
                <a
                  href="/api/auth/logout"
                  className="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#C2948A' }}
                >
                  Logout
                </a>
              </>
            ) : (
              <a
                href="/api/auth/login"
                className="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: '#C2948A' }}
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

