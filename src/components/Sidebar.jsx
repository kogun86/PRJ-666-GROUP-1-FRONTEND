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
import { useAuth } from '../features/auth/context/AuthContext';

const Sidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navLinks = [
    { name: 'Courses', path: '/courses', icon: BookText },
    { name: 'Events', path: '/events', icon: CalendarDays },
    { name: 'Smart To-Do', path: '/todo', icon: ListTodo },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Tips', path: '/tips', icon: HelpCircle },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
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
                    <AvatarFallback className="avatar-fallback">
                      {user?.name
                        ? user.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="sidebar-username">{user?.name || 'User'}</div>
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
          <button onClick={logout} className="logout-button">
            <LogOut className="logout-icon" />
            <span className="logout-text">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
