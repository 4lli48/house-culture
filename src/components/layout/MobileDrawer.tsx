import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  LayoutDashboard,
  MonitorSmartphone,
  Folder,
  BarChart3,
  Users,
  User,
  LogOut,
  X,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard'), end: true },
    { to: '/devices', icon: MonitorSmartphone, label: t('devices'), end: true },
    { to: '/categories', icon: Folder, label: t('categories') },
    { to: '/reports', icon: BarChart3, label: t('reports') },
    { to: '/users', icon: Users, label: t('users') },
    { to: '/profile', icon: User, label: t('profile') },
    { to: '/profile?tab=settings', icon: Sliders, label: t('settings') },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 w-72 bg-white dark:bg-navy-900 border-r rtl:border-r-0 rtl:border-l border-ivory-300 dark:border-navy-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-ivory-200 dark:border-navy-800">
          <Link to="/" onClick={onClose} className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gold-gradient text-white shadow-gold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-navy-900 dark:text-white leading-tight">
                بيت الثقافة
              </span>
              <span className="text-[11px] font-bold text-gold-600 dark:text-gold-400">
                بحائل
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-navy-400 hover:text-navy-900 dark:hover:text-white hover:bg-ivory-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200',
                  isActive
                    ? 'bg-gold-500/15 text-gold-700 dark:text-gold-400 border border-gold-500/20'
                    : 'text-navy-700 dark:text-navy-200 hover:bg-ivory-100 dark:hover:bg-navy-800'
                )
              }
            >
              <item.icon className="w-5 h-5 text-gold-500 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-ivory-200 dark:border-navy-800 bg-ivory-50 dark:bg-navy-950 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white dark:bg-navy-800 border border-ivory-200 dark:border-navy-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-gradient text-white font-extrabold text-sm shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-navy-900 dark:text-white truncate">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-navy-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => { onClose(); await signOut(); }}
            className="flex items-center w-full gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
