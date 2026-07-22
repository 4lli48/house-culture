import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Menu, Moon, Settings, Sun, ChevronDown, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { cn, getUserRoleLabel } from '../../lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
}

const PAGE_TITLES: Record<string, { titleKey: string; subtitle: string }> = {
  '/': { titleKey: 'dashboard', subtitle: 'مركز قيادة وتتبع المخزون الرقمي' },
  '/devices': { titleKey: 'devices', subtitle: 'سجل وأصول المعدات والأجهزة الرقمية' },
  '/categories': { titleKey: 'categories', subtitle: 'تصنيفات وفئات الأجهزة المحصاة' },
  '/reports': { titleKey: 'reports', subtitle: 'التقارير التحليلية والتصدير' },
  '/users': { titleKey: 'users', subtitle: 'المستخدمون وسجل النشاطات والحوكمة' },
  '/profile': { titleKey: 'profile', subtitle: 'إدارة حساب المستخدم والتفضيلات' },
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const { i18n, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const matchedPath = Object.keys(PAGE_TITLES)
    .filter((k) => (k === '/' ? location.pathname === '/' : location.pathname.startsWith(k)))
    .sort((a, b) => b.length - a.length)[0];

  const currentInfo = matchedPath ? PAGE_TITLES[matchedPath] : { titleKey: '', subtitle: 'بيت الثقافة بحائل' };
  const pageTitle = currentInfo.titleKey ? t(currentInfo.titleKey) : '';

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

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-8 bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-navy-800 transition-colors duration-300">
      {/* Left: Mobile Menu Toggle & Page Title */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2.5 text-slate-600 dark:text-slate-300 rounded-2xl lg:hidden hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white transition-colors shrink-0"
          aria-label={t('open_menu')}
        >
          <Menu className="w-6 h-6" />
        </button>

        {pageTitle && (
          <div className="hidden sm:block min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-navy-900 dark:text-white truncate leading-tight">
                {pageTitle}
              </h1>
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
              {currentInfo.subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-extrabold text-navy-800 dark:text-ivory-200 rounded-2xl border border-slate-200/80 dark:border-navy-700 hover:border-gold-500/50 bg-slate-50/80 dark:bg-navy-800/80 hover:bg-white dark:hover:bg-navy-800 transition-all duration-200 shadow-xs"
          aria-label={t('language')}
        >
          <Globe className="w-4 h-4 text-gold-500" />
          <span className="uppercase tracking-wider">{i18n.language === 'en' ? 'العربية' : 'EN'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 text-navy-800 dark:text-ivory-200 rounded-2xl border border-slate-200/80 dark:border-navy-700 hover:border-gold-500/50 bg-slate-50/80 dark:bg-navy-800/80 hover:bg-white dark:hover:bg-navy-800 transition-all duration-200 shadow-xs"
          aria-label={t('theme')}
        >
          {theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5 text-gold-400" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-navy-700 dark:text-slate-300" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-navy-800 mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className={cn(
              'flex items-center gap-3 p-1.5 sm:px-3 sm:py-2 rounded-2xl border transition-all duration-200',
              profileOpen
                ? 'bg-slate-100 dark:bg-navy-800 border-gold-500/40'
                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-navy-800 hover:border-slate-200 dark:hover:border-navy-700'
            )}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gold-gradient text-white font-extrabold text-sm shadow-gold-sm shrink-0">
              {userInitial}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-900" />
            </div>

            <div className="hidden md:flex flex-col text-left rtl:text-right min-w-0">
              <span className="text-xs font-extrabold text-navy-900 dark:text-white truncate max-w-[120px] leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-gold-600 dark:text-gold-400 font-bold leading-tight mt-0.5">
                {getUserRoleLabel(user?.email)}
              </span>
            </div>
            <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', profileOpen && 'rotate-180')} />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute ltr:right-0 rtl:left-0 top-full mt-2.5 w-60 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-700 shadow-2xl animate-fade-in z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-navy-800 bg-slate-50/80 dark:bg-navy-950/60">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gold-gradient text-white font-extrabold shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-navy-900 dark:text-white truncate">{userName}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                  className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-navy-800 dark:text-ivory-200 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-gold-600 transition-colors"
                >
                  <User className="w-4 h-4 text-gold-500" />
                  <span>{t('profile')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); navigate('/profile?tab=settings'); }}
                  className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-navy-800 dark:text-ivory-200 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-gold-600 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gold-500" />
                  <span>{t('settings')}</span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-navy-800" />

                <button
                  type="button"
                  onClick={async () => { setProfileOpen(false); await signOut(); }}
                  className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
