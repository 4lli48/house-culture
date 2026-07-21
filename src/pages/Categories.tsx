import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Folder, MonitorSmartphone, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';

export default function Categories() {
  const { t, i18n } = useTranslation();
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

  const ArrowIcon = i18n.language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-ivory-300 dark:border-navy-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
          {t('categories')}
        </h1>
        <p className="mt-1 text-sm font-semibold text-navy-500 dark:text-navy-400">
          {t('categories_description')}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
          <span className="text-sm font-medium text-navy-400">{t('loading')}</span>
        </div>
      ) : error ? (
        <div className="surface-card p-6 rounded-2xl border-rose-200 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
          {error.message}
        </div>
      ) : categories.length === 0 ? (
        <div className="surface-card p-12 rounded-2xl text-center text-navy-400 font-semibold">
          {t('no_data')}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/devices?category=${encodeURIComponent(category.name)}`}
              className="surface-card surface-card-hover p-6 rounded-2xl flex items-center justify-between gap-4 group"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="rounded-2xl bg-gold-gradient p-3.5 text-white shadow-gold shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Folder className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-navy-900 dark:text-white text-base group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    {category.name}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-navy-400 mt-1">
                    <span>{t('view_devices')}</span>
                    <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-ivory-100 dark:bg-navy-800 border border-ivory-300 dark:border-navy-700 px-3.5 py-1.5 text-xs font-extrabold text-navy-900 dark:text-gold-400 shrink-0">
                <MonitorSmartphone className="h-3.5 w-3.5 text-gold-500" />
                <span>{category.count}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
