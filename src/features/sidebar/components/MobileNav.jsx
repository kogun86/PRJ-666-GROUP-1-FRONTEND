'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, CalendarDays, BookText, ListTodo, Target, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { cn } from '../../events/utils/utils';

export default function MobileNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Courses', path: '/courses', icon: BookText },
    { name: 'Events', path: '/events', icon: CalendarDays },
    { name: 'Todo', path: '/todo', icon: ListTodo },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
  ];

  return (
    <div className="mobile-nav">
      <nav className="mobile-nav-menu">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={cn('mobile-nav-link', pathname === link.path && 'active')}
            >
              <Icon className="mobile-nav-icon" />
              <span className="mobile-nav-text">{link.name}</span>
            </Link>
          );
        })}
        <button onClick={logout} className={cn('mobile-nav-link')}>
          <div className="logout-icon-container">
            <LogOut className="mobile-nav-icon logout-icon" />
          </div>
          <span className="mobile-nav-text" style={{ color: '#a72f38' }}>
            Logout
          </span>
        </button>
      </nav>
    </div>
  );
}
