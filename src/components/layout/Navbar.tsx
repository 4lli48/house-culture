import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  LayoutDashboard,
  MonitorSmartphone,
  Folder,
  BarChart3,
  Users,
  User,
  Globe,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Menu,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.email?.split('@')[0] || 'User';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard'), end: true },
    { to: '/devices', icon: MonitorSmartphone, label: t('devices'), end: true },
    { to: '/categories', icon: Folder, label: t('categories') },
    { to: '/reports', icon: BarChart3, label: t('reports') },
    { to: '/users', icon: Users, label: t('users') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-b border-ivory-300 dark:border-navy-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="p-2 text-navy-700 dark:text-ivory-200 rounded-xl lg:hidden hover:bg-ivory-100 dark:hover:bg-navy-800 transition-colors"
              aria-label={t('open_menu')}
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gold-gradient text-white shadow-gold group-hover:scale-105 transition-transform duration-300">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-navy-900 dark:text-white leading-tight">
                  بيت الثقافة
                </span>
                <span className="text-xs font-semibold text-gold-600 dark:text-gold-400 tracking-wider">
                  بحائل — نظام إدارة المخزون
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200',
                    isActive
                      ? 'bg-gold-500/10 dark:bg-gold-500/20 text-gold-700 dark:text-gold-400 border border-gold-500/20 shadow-xs'
                      : 'text-navy-700 dark:text-navy-200 hover:bg-ivory-100 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white'
                  )
                }
              >
                <item.icon className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Controls: Language, Theme & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-navy-800 dark:text-ivory-200 rounded-xl border border-ivory-300 dark:border-navy-700 bg-ivory-50 dark:bg-navy-800 hover:border-gold-500/50 transition-all duration-200"
              aria-label={t('language')}
            >
              <Globe className="w-4 h-4 text-gold-500" />
              <span className="uppercase">{i18n.language === 'en' ? 'العربية' : 'EN'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 text-navy-800 dark:text-ivory-200 rounded-xl border border-ivory-300 dark:border-navy-700 bg-ivory-50 dark:bg-navy-800 hover:border-gold-500/50 transition-all duration-200"
              aria-label={t('theme')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-gold-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-navy-700" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-transparent hover:border-ivory-300 dark:hover:border-navy-700 hover:bg-ivory-50 dark:hover:bg-navy-800 transition-all duration-200"
              >
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gold-gradient text-white font-extrabold text-sm shadow-gold shrink-0">
                  {userInitial}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-900" />
                </div>
                <div className="hidden md:flex flex-col text-left rtl:text-right">
                  <span className="text-xs font-extrabold text-navy-900 dark:text-white truncate max-w-[110px] leading-tight">
                    {userName}
                  </span>
                  <span className="text-[10px] text-gold-600 dark:text-gold-400 font-bold leading-tight">
                    {t('admin')}
                  </span>
                </div>
                <ChevronDown className={cn('w-4 h-4 text-navy-400 transition-transform duration-200', profileOpen && 'rotate-180')} />
              </button>

              {profileOpen && (
                <div className="absolute ltr:right-0 rtl:left-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-navy-900 border border-ivory-300 dark:border-navy-700 shadow-card-md animate-fade-in z-50 overflow-hidden">
                  <div className="p-4 border-b border-ivory-200 dark:border-navy-800 bg-ivory-50 dark:bg-navy-950">
                    <p className="text-xs font-extrabold text-navy-900 dark:text-white truncate">{userName}</p>
                    <p className="text-[11px] text-navy-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                      className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-navy-700 dark:text-ivory-200 hover:bg-ivory-100 dark:hover:bg-navy-800 hover:text-gold-600 transition-colors"
                    >
                      <User className="w-4 h-4 text-gold-500" />
                      <span>{t('profile')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setProfileOpen(false); navigate('/profile?tab=settings'); }}
                      className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-navy-700 dark:text-ivory-200 hover:bg-ivory-100 dark:hover:bg-navy-800 hover:text-gold-600 transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-gold-500" />
                      <span>{t('settings')}</span>
                    </button>
                    <div className="my-1 border-t border-ivory-200 dark:border-navy-800" />
                    <button
                      type="button"
                      onClick={async () => { setProfileOpen(false); await signOut(); }}
                      className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
