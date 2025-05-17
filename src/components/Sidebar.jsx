'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Calendar', path: '/calendar' },
    { name: 'Courses', path: '/courses' },
    { name: 'Events', path: '/events' },
    { name: 'Goals', path: '/goals' },
    { name: 'Profile', path: '/profile' },
    { name: 'Todo', path: '/todo' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 bg-[#2F3E46] flex flex-col w-[320px] z-10 test-class">
      <div className="flex flex-col h-full">
        {/* User profile section */}
        <div className="p-2 mb-6">
          <Link href="/profile">
            <div className="w-full h-[70px] bg-[#CAD2C5] flex items-center px-4 rounded cursor-pointer">
              <div className="w-[50px] h-[50px] bg-[#2F3E46] rounded-full flex items-center justify-center mr-4">
                <div className="w-[34px] h-[40px] flex items-center justify-center text-white">
                  DB
                </div>
              </div>
              <div className="text-[#2F3E46] text-2xl font-normal">Daniil Boiko</div>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4">
          <div className="space-y-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`bg-[#52796F] w-full h-[35px] flex items-center px-4 rounded ${
                  pathname === item.path ? 'bg-opacity-80' : ''
                }`}
              >
                <span className="text-[#CAD2C5] text-base">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout button */}
        <div className="px-4 py-4 mt-auto">
          <Link
            href="/login"
            className="bg-[#A72F38] w-full h-[35px] flex items-center px-4 rounded"
          >
            <span className="text-[#CAD2C5] text-base">Log Out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
