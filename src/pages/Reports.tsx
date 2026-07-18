import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, Download, Folder, MonitorSmartphone } from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { DEVICE_STATUSES, getStatusLabelKey, getStatusTone } from '../lib/deviceUtils';
import type { Device } from '../hooks/useDevices';

export default function Reports() {
  const { t } = useTranslation();
  const { devices, loading, error } = useDevices();

  const statusRows = useMemo(() => {
    return DEVICE_STATUSES.map((status) => {
      const count = devices.filter((device) => device.status === status).length;
      return {
        status,
        count,
        percentage: devices.length ? Math.round((count / devices.length) * 100) : 0,
        tone: getStatusTone(status),
      };
    });
  }, [devices]);

  const categoryRows = useMemo(() => {
    const counts = devices.reduce<Record<string, number>>((acc, device) => {
      acc[device.category] = (acc[device.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [devices]);

  const exportCsv = () => {
    const headers = ['inventory_code', 'name', 'category', 'status', 'location', 'updated_at'];
    const rows = devices.map((device) =>
      headers
        .map((key) => {
          const value = String(device[key as keyof Device] ?? '');
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'device-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('reports')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('reports_description')}</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={devices.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Download className="h-4 w-4" />
          {t('export_csv')}
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          {t('loading')}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
          {error.message}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <MonitorSmartphone className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{t('total_devices')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{devices.length}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Folder className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{t('categories')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{categoryRows.length}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{t('working')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {statusRows.find((row) => row.status === 'Working')?.count || 0}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('status_report')}</h2>
              <div className="mt-4 space-y-4">
                {statusRows.map((row) => (
                  <Link key={row.status} to={`/devices?status=${row.status}`} className="block">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-200">{t(getStatusLabelKey(row.status))}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {row.count} ({row.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <div className="h-2 rounded-full" style={{ width: `${row.percentage}%`, backgroundColor: row.tone.color }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('category_report')}</h2>
              <div className="mt-4 max-h-80 space-y-3 overflow-y-auto scroll-smooth">
                {categoryRows.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('no_data')}</p>
                ) : (
                  categoryRows.map((row) => (
                    <Link
                      key={row.category}
                      to={`/devices?category=${encodeURIComponent(row.category)}`}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                    >
                      <span className="font-medium text-gray-700 dark:text-gray-200">{row.category}</span>
                      <span className="text-gray-500 dark:text-gray-400">{row.count}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
