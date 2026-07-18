import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, CircleOff, MonitorSmartphone, Wrench } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useDevices, type Device } from '../hooks/useDevices';
import { DEVICE_STATUSES, getStatusBadgeClass, getStatusLabelKey, getStatusTone } from '../lib/deviceUtils';

const statusIcons = {
  Working: CheckCircle,
  Maintenance: Wrench,
  Broken: AlertTriangle,
  Lost: CircleOff,
} satisfies Record<Device['status'], typeof CheckCircle>;

export default function Dashboard() {
  const { t } = useTranslation();
  const { devices, loading, error } = useDevices();

  const statusCounts = useMemo(() => {
    return DEVICE_STATUSES.reduce<Record<Device['status'], number>>((acc, status) => {
      acc[status] = devices.filter((device) => device.status === status).length;
      return acc;
    }, { Working: 0, Maintenance: 0, Broken: 0, Lost: 0 });
  }, [devices]);

  const totalDevices = devices.length;

  const stats = [
    {
      label: t('total_devices'),
      value: totalDevices,
      icon: MonitorSmartphone,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/50',
      border: 'hover:border-blue-300 dark:hover:border-blue-700',
      to: '/devices',
    },
    ...DEVICE_STATUSES.map((status) => {
      const tone = getStatusTone(status);
      return {
        label: t(getStatusLabelKey(status)),
        value: statusCounts[status],
        icon: statusIcons[status],
        color: tone.text,
        bg: tone.bg,
        border: tone.border,
        to: `/devices?status=${status}`,
      };
    }),
  ];

  const chartData = DEVICE_STATUSES.map((status) => {
    const count = statusCounts[status];
    return {
      status,
      name: t(getStatusLabelKey(status)),
      value: count,
      percentage: totalDevices ? Math.round((count / totalDevices) * 100) : 0,
      color: getStatusTone(status).color,
    };
  });

  const recentDevices = useMemo(() => {
    return [...devices].sort(
      (a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
    );
  }, [devices]);

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
        <h1 className="text-lg font-semibold">{t('error')}</h1>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard')}</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className={`p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${stat.border}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('device_status_distribution')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('total_devices')}: {totalDevices}
            </p>
          </div>

          {totalDevices === 0 ? (
            <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {t('no_data')}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[minmax(180px,1fr)_minmax(180px,0.9fr)]">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius="58%"
                      outerRadius="82%"
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.status} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _name, item) => {
                        const payload = item.payload as (typeof chartData)[number];
                        return [`${value} (${payload.percentage}%)`, payload.name];
                      }}
                      contentStyle={{ borderRadius: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 self-center">
                {chartData.map((entry) => (
                  <Link
                    key={entry.status}
                    to={`/devices?status=${entry.status}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                  >
                    <span className="flex min-w-0 items-center gap-2 font-medium text-gray-700 dark:text-gray-200">
                      <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="truncate">{entry.name}</span>
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {entry.value} ({entry.percentage}%)
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('recent_activity')}</h2>
          {recentDevices.length === 0 ? (
            <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {t('no_data')}
            </div>
          ) : (
            <div className="max-h-96 space-y-3 overflow-y-auto scroll-smooth pr-1">
              {recentDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900 dark:text-white">{device.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{device.inventory_code}</p>
                    <time className="text-xs text-gray-400 dark:text-gray-500" dateTime={device.updated_at || device.created_at}>
                      {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
                        new Date(device.updated_at || device.created_at)
                      )}
                    </time>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(device.status)}`}>
                    {t(getStatusLabelKey(device.status))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
