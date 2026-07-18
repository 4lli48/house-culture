import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Folder,
  LayoutDashboard,
  LogOut,
  MonitorSmartphone,
  PlusCircle,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard'), end: true },
    { to: '/devices', icon: MonitorSmartphone, label: t('devices'), end: true },
    { to: '/devices/new', icon: PlusCircle, label: t('add_device') },
    { to: '/categories', icon: Folder, label: t('categories') },
    { to: '/reports', icon: BarChart3, label: t('reports') },
    { to: '/users', icon: Users, label: t('users') },
    { to: '/profile', icon: User, label: t('profile') },
    { to: '/settings', icon: Settings, label: t('settings') },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 ltr:left-0 rtl:right-0 z-30 w-64 bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 transition-transform lg:static lg:!translate-x-0 flex flex-col',
          isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
        )}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">بيت الثقافة</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={t('close_menu')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
