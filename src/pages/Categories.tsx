import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Folder, MonitorSmartphone } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';

export default function Categories() {
  const { t } = useTranslation();
  const { devices, loading, error } = useDevices();

  const categories = useMemo(() => {
    const counts = devices.reduce<Record<string, number>>((acc, device) => {
      acc[device.category] = (acc[device.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [devices]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('categories')}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('categories_description')}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('loading')}</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 dark:text-red-400">{error.message}</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('no_data')}</div>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/devices?category=${encodeURIComponent(category.name)}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-primary-700"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-lg bg-primary-50 p-3 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                    <Folder className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900 dark:text-white">{category.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('view_devices')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                  <MonitorSmartphone className="h-4 w-4" />
                  {category.count}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
