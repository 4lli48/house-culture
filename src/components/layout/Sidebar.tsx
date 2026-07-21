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
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem = ({
  to,
  icon: Icon,
  label,
  end,
  onClick,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
  onClick: () => void;
}) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50',
        isActive
          ? 'bg-gradient-to-r from-gold-500/15 to-gold-500/5 dark:from-gold-500/20 dark:to-gold-500/5 text-gold-700 dark:text-gold-400 font-semibold shadow-sm border border-gold-500/20 dark:border-gold-500/15'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-navy-800/70 hover:text-navy-900 dark:hover:text-slate-200 border border-transparent'
      )
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gold-500 rounded-r-full rtl:rounded-r-none rtl:rounded-l-full" />
        )}
        <Icon
          className={cn(
            'w-4.5 h-4.5 shrink-0 transition-colors duration-200',
            isActive
              ? 'text-gold-500 dark:text-gold-400'
              : 'text-slate-400 group-hover:text-gold-500 dark:text-slate-500 dark:group-hover:text-gold-400'
          )}
        />
        <span className="truncate leading-tight">{label}</span>
        {isActive && (
          <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0 text-gold-500/60 ltr:ml-auto rtl:mr-auto rtl:rotate-180" />
        )}
      </>
    )}
  </NavLink>
);

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

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
          'fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 w-64 bg-white dark:bg-navy-900 border-r rtl:border-r-0 rtl:border-l border-slate-200/80 dark:border-navy-800/80 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:static lg:!translate-x-0 lg:shadow-none',
          isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
        )}
        aria-label="Main navigation"
      >
        {/* Brand Header */}
        <div className="relative flex items-center justify-between h-[72px] px-5 border-b border-slate-100 dark:border-navy-800/80 shrink-0 overflow-hidden">
          {/* subtle geometric pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C5A059' fill-opacity='1'%3E%3Cpath d='M20 0L40 20L20 40L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px',
            }}
          />
          <Link to="/" onClick={close} className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-white shadow-gold-sm shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold tracking-tight text-navy-900 dark:text-white leading-tight truncate">
                بيت الثقافة
              </p>
              <p className="text-[11px] font-semibold text-gold-600 dark:text-gold-400 truncate leading-tight">
                نظام إدارة المخزون
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={close}
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors lg:hidden shrink-0"
            aria-label={t('close_menu')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto" aria-label="Sidebar navigation">
          {/* Main Section */}
          <div className="space-y-1">
            <p className="px-3.5 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              {t('main_nav')}
            </p>
            {mainNav.map((item) => (
              <NavItem key={item.to} {...item} onClick={close} />
            ))}
          </div>

          {/* Admin Section */}
          <div className="space-y-1">
            <p className="px-3.5 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              {t('admin_nav')}
            </p>
            {adminNav.map((item) => (
              <NavItem key={item.to} {...item} onClick={close} />
            ))}
          </div>

          {/* Account Section */}
          <div className="space-y-1">
            <p className="px-3.5 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              {t('account_nav')}
            </p>
            {accountNav.map((item) => (
              <NavItem key={item.to} {...item} onClick={close} />
            ))}
          </div>
        </nav>

        {/* User Profile + Logout Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-navy-800/80 bg-slate-50/60 dark:bg-navy-950/40 shrink-0 space-y-2">
          {/* User pill */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200/80 dark:border-navy-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-white font-bold text-sm shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-navy-900 dark:text-white truncate leading-tight">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate leading-tight">{user?.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-3.5 py-2.5 text-sm font-semibold text-rose-500 dark:text-rose-400 transition-all duration-200 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            <span className="truncate">{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
