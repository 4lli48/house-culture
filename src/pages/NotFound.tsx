
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
        {t('not_found')}
      </h2>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 mt-8 text-sm font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
      >
        <Home className="w-5 h-5" />
        {t('back_home')}
      </Link>
    </div>
  );
}
