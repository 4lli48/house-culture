
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile')}</h1>
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold dark:bg-primary-900 dark:text-primary-300">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.email}</h2>
            <p className="text-gray-500 dark:text-gray-400">Employee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
