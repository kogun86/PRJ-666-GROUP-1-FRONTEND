'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  CalendarDays,
  BookText,
  ListTodo,
  MoreHorizontal,
  Target,
  Calendar,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

export default function MobileNav() {
  const pathname = usePathname();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Events', path: '/events', icon: CalendarDays },
    { name: 'Courses', path: '/courses', icon: BookText },
    { name: 'Todo', path: '/todo', icon: ListTodo },
  ];

  const moreLinks = [
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Logout', path: '/login', icon: LogOut, className: 'more-menu-logout' },
  ];

  const toggleMoreMenu = () => {
    setMoreMenuOpen(!moreMenuOpen);
  };

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
        <Button onClick={toggleMoreMenu} variant="ghost" className="mobile-nav-link">
          <MoreHorizontal className="mobile-nav-icon" />
          <span className="mobile-nav-text">More</span>
        </Button>
      </nav>

      {moreMenuOpen && (
        <div className="mobile-nav-more-menu">
          {moreLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.path} href={link.path}>
                <div className={cn('more-menu-item', link.className)}>
                  <Icon className="more-menu-icon" />
                  <span>{link.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
