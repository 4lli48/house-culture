import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, Moon, Settings, Sun, ChevronDown, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
}

// Map route to page title keys
const PAGE_TITLES: Record<string, string> = {
  '/': 'dashboard',
  '/devices': 'devices',
  '/categories': 'categories',
  '/reports': 'reports',
  '/users': 'users',
  '/profile': 'profile',
  '/settings': 'settings',
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const { i18n, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Derive page title from current path
  const pathKey = Object.keys(PAGE_TITLES)
    .filter((k) => location.pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  const pageTitle = pathKey ? t(PAGE_TITLES[pathKey]) : '';

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.email?.split('@')[0] || 'User';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[72px] px-4 sm:px-6 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-navy-800 transition-colors duration-300">
      {/* Left: Menu toggle + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 text-slate-500 rounded-xl lg:hidden hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white transition-colors"
          aria-label={t('open_menu')}
        >
          <Menu className="w-5 h-5" />
        </button>
        {pageTitle && (
          <div className="hidden sm:block min-w-0">
            <h2 className="text-base font-bold text-navy-900 dark:text-white truncate leading-tight">
              {pageTitle}
            </h2>
            <p className="text-[11px] font-medium text-slate-400 truncate leading-tight">
              بيت الثقافة بحائل
            </p>
          </div>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-gold-500/50 bg-slate-50/50 dark:bg-navy-800/50 hover:bg-white dark:hover:bg-navy-800 transition-all duration-200"
          aria-label={t('language')}
        >
          <Globe className="w-3.5 h-3.5 text-gold-500" />
          <span className="uppercase tracking-wide">{i18n.language === 'en' ? 'ع' : 'EN'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-gold-500/50 bg-slate-50/50 dark:bg-navy-800/50 hover:bg-white dark:hover:bg-navy-800 transition-all duration-200"
          aria-label={t('theme')}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-gold-400" />
          ) : (
            <Moon className="w-4 h-4 text-navy-700 dark:text-slate-300" />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-navy-700 mx-1" />

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className={cn(
              'flex items-center gap-2.5 px-2 py-1.5 rounded-xl border transition-all duration-200',
              profileOpen
                ? 'bg-slate-100 dark:bg-navy-800 border-gold-500/40'
                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-navy-800 hover:border-slate-200 dark:hover:border-navy-700'
            )}
          >
            {/* Avatar */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-white font-bold text-sm shadow-gold-sm ring-2 ring-gold-500/20 shrink-0">
              {userInitial}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-900" />
            </div>

            {/* Name — hidden on small screens */}
            <div className="hidden md:flex flex-col text-left rtl:text-right">
              <span className="text-xs font-bold text-navy-900 dark:text-white truncate max-w-[110px] leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight">
                {user?.email?.split('@')[1] ? `@${user.email.split('@')[1]}` : ''}
              </span>
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', profileOpen && 'rotate-180')} />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute ltr:right-0 rtl:left-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200/80 dark:border-navy-700 shadow-xl dark:shadow-dark-card animate-fade-in-down z-50 overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3.5 border-b border-slate-100 dark:border-navy-700">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-white font-bold shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy-900 dark:text-white truncate">{userName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5 space-y-0.5">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-700/60 hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-150"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{t('profile')}</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-700/60 hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-150"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>{t('settings')}</span>
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-navy-700" />

                <button
                  type="button"
                  onClick={async () => { setProfileOpen(false); await signOut(); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
