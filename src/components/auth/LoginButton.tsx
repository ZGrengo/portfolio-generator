/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export default function LoginButton() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>Welcome, {user.name}</span>
        <a
          href="/api/auth/logout"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </a>
      </div>
    );
  }

  return (
    <a
      href="/api/auth/login"
      className="text-white px-4 py-2 rounded transition-colors hover:opacity-90"
      style={{ backgroundColor: '#C2948A' }}
    >
      Login
    </a>
  );
} 