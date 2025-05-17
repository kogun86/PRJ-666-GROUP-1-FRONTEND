'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  User,
  CalendarDays,
  BookText,
  ListTodo,
  Target,
  HelpCircle,
  Calendar,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';

const Sidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Courses', path: '/courses', icon: BookText, color: 'bg-[#52796F]' },
    { name: 'Events', path: '/events', icon: CalendarDays, color: 'bg-[#52796F]' },
    { name: 'Smart To-Do', path: '/todo', icon: ListTodo, color: 'bg-[#52796F]' },
    { name: 'Goals', path: '/goals', icon: Target, color: 'bg-[#52796F]' },
    { name: 'Tips', path: '/tips', icon: HelpCircle, color: 'bg-[#52796F]' },
    { name: 'Calendar', path: '/calendar', icon: Calendar, color: 'bg-[#52796F]' },
  ];

  return (
    <aside className="sidebar">
      <div className="flex flex-col h-full">
        {/* User profile section */}
        <div className="sidebar-profile">
          <Link
            href="/profile"
            className={cn('sidebar-profile-link', pathname === '/profile' && 'active')}
          >
            <div className="sidebar-profile-container">
              <div className="sidebar-avatar-container">
                <div className="sidebar-avatar-inner">
                  <Avatar>
                    <AvatarFallback className="bg-[#2F3E46] text-white">DB</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="sidebar-username">Daniil Boiko</div>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-links">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn('nav-link', pathname === link.path && 'active')}
                >
                  <Icon className="nav-link-icon" />
                  <span className="nav-link-text">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout button */}
        <div className="sidebar-footer">
          <Link href="/login" className="logout-button">
            <LogOut className="logout-icon" />
            <span className="logout-text">Log Out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
