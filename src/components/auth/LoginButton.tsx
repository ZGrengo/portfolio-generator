'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function LoginButton() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>Welcome, {user.name}</span>
        <Link 
          href="/api/auth/logout"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </Link>
      </div>
    );
  }

  return (
    <Link 
      href="/api/auth/login"
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      Login
    </Link>
  );
} 