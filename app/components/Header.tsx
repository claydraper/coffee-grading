'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

export default function Header() {
  const pathname = usePathname();
  const [showCuppingsMenu, setShowCuppingsMenu] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowCuppingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                Coffee Grading App
              </Link>
              <div className="relative">
                <button
                  className="group cursor-pointer text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  onClick={() => setShowCuppingsMenu(!showCuppingsMenu)}
                >
                  <span>Cuppings</span>
                  <div className={`transition-transform duration-200 ${showCuppingsMenu ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </button>
                {showCuppingsMenu && (
                  <div className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        href="/cuppings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setShowCuppingsMenu(false)}
                      >
                        View All Cuppings
                      </Link>
                      <Link
                        href="/cuppings/new"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setShowCuppingsMenu(false)}
                      >
                        New Cupping
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {status === 'authenticated' && (
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                Welcome, {session?.user?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="cursor-pointer px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
