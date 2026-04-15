'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChangedListener } from '../google-firebase/authentication';
import { User } from 'firebase/auth';
import UserMenu from './user-menu';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((currentUser) => {
      setUser(currentUser)
    });

    return () => {
      unsubscribe()
    };
  }, [])

  return (
    <nav className="w-full flex items-center justify-between px-4">
      {user ? (
        <span className="text-gray-700">Welcome, {user.displayName}</span>
      ) : (
        <span className="text-gray-700"></span>
      )}
      <UserMenu user={user} />
    </nav>
  );
}