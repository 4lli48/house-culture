
import { Languages, Menu, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { i18n, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8 dark:bg-gray-800 dark:border-gray-700 transition-colors">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label={t('open_menu')}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleLanguage}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Toggle Language"
          aria-label={t('language')}
        >
          <Languages className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Toggle Theme"
          aria-label={t('theme')}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center gap-3 ltr:ml-4 rtl:mr-4">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
