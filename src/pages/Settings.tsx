import { useTranslation } from 'react-i18next';
import { Languages, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-gray-100 p-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('theme')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('theme_description')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? t('disable') : t('enable')}
          </button>
        </div>

        <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-gray-100 p-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('language')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('language_description')}</p>
            </div>
          </div>
          <select
            value={i18n.resolvedLanguage || i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      </div>
    </div>
  );
}
