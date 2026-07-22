import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Building2,
  Folder,
  LayoutDashboard,
  LogOut,
  MonitorSmartphone,
  User,
  Users,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
  onClick: () => void;
}

const NavItem = ({ to, icon: Icon, label, end, onClick }: NavItemProps) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 outline-none select-none',
        isActive
          ? 'bg-gold-500/12 dark:bg-gold-500/20 text-gold-700 dark:text-gold-400 font-extrabold shadow-xs border border-gold-500/25'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/90 dark:hover:bg-navy-800/80 hover:text-navy-900 dark:hover:text-white border border-transparent'
      )
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <span className="absolute ltr:-left-0.5 rtl:-right-0.5 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gold-500 rounded-r-full rtl:rounded-r-none rtl:rounded-l-full shadow-gold-sm" />
        )}
        <div
          className={cn(
            'p-1.5 rounded-xl transition-colors duration-200 shrink-0',
            isActive
              ? 'bg-gold-500/15 dark:bg-gold-500/30 text-gold-600 dark:text-gold-400'
              : 'text-slate-400 dark:text-slate-500 group-hover:text-gold-600 dark:group-hover:text-gold-400 group-hover:bg-gold-500/10'
          )}
        >
          <Icon className="w-4.5 h-4.5" />
        </div>
        <span className="truncate leading-none">{label}</span>
        {isActive && (
          <ChevronRight className="w-4 h-4 ltr:ml-auto rtl:mr-auto shrink-0 text-gold-500/70 ltr:ml-auto rtl:mr-auto rtl:rotate-180" />
        )}
      </>
    )}
  </NavLink>
);

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.email?.split('@')[0] || 'User';

  const mainNav = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard'), end: true },
    { to: '/devices', icon: MonitorSmartphone, label: t('devices'), end: true },
    { to: '/categories', icon: Folder, label: t('categories') },
    { to: '/reports', icon: BarChart3, label: t('reports') },
  ];

  const adminNav = [
    { to: '/users', icon: Users, label: t('users') },
  ];

  const accountNav = [
    { to: '/profile', icon: User, label: t('profile') },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-md transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 w-72 bg-white dark:bg-navy-900 border-r rtl:border-r-0 rtl:border-l border-slate-200/80 dark:border-navy-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:static lg:!translate-x-0 lg:shadow-none',
          isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
        )}
        aria-label="Main navigation"
      >
        {/* Brand Header */}
        <div className="relative flex items-center justify-between h-20 px-6 border-b border-slate-100 dark:border-navy-800 shrink-0 overflow-hidden bg-gradient-to-r from-white via-ivory-50/50 to-white dark:from-navy-900 dark:via-navy-900 dark:to-navy-900">
          {/* Subtle geometric overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C5943A' fill-opacity='1'%3E%3Cpath d='M20 0L40 20L20 40L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '24px 24px',
            }}
          />

          <Link to="/" onClick={close} className="flex items-center gap-3.5 min-w-0 group">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gold-gradient text-white shadow-gold shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-base font-extrabold tracking-tight text-navy-900 dark:text-white leading-tight truncate">
                  بيت الثقافة
                </p>
              </div>
              <p className="text-xs font-bold text-gold-600 dark:text-gold-400 truncate leading-tight mt-0.5">
                بحائل — نظام المخزون
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={close}
            className="p-2 rounded-xl text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors lg:hidden shrink-0"
            aria-label={t('close_menu')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto" aria-label="Sidebar navigation">
          {/* Main Section */}
          <div className="space-y-1.5">
            <p className="px-4 mb-2 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {t('main_nav')}
            </p>
            {mainNav.map((item) => (
              <NavItem key={item.to} {...item} onClick={close} />
            ))}
          </div>

          {/* Admin Section */}
          <div className="space-y-1.5">
            <p className="px-4 mb-2 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {t('admin_nav')}
            </p>
            {adminNav.map((item) => (
              <NavItem key={item.to} {...item} onClick={close} />
            ))}
          </div>

          {/* Account Section */}
          <div className="space-y-1.5">
            <p className="px-4 mb-2 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {t('account_nav')}
            </p>
            {accountNav.map((item) => (
              <NavItem key={item.to} {...item} onClick={close} />
            ))}
          </div>
        </nav>

        {/* User Card + Logout Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50/80 dark:bg-navy-950/50 shrink-0 space-y-2.5">
          {/* User Profile Summary */}
          <Link
            to="/profile"
            onClick={close}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200/80 dark:border-navy-700 hover:border-gold-500/40 transition-all duration-200 shadow-xs"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gold-gradient text-white font-extrabold text-sm shadow-gold-sm shrink-0">
              {userInitial}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-800" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-navy-900 dark:text-white truncate leading-tight">
                {userName}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
                {user?.email}
              </p>
            </div>
            <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-2.5 text-xs font-extrabold text-rose-600 dark:text-rose-400 transition-all duration-200 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="truncate">{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
