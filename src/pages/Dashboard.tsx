import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, CheckCircle, CircleOff, MonitorSmartphone, Wrench,
  CalendarDays, ArrowRight, ArrowLeft, ShieldCheck, Activity,
} from 'lucide-react';
import {
  Cell, Pie, PieChart, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useDevices, type Device } from '../hooks/useDevices';
import { DEVICE_STATUSES, getStatusBadgeClass, getStatusLabelKey, getStatusTone } from '../lib/deviceUtils';

const statusIcons = {
  Working: CheckCircle,
  Maintenance: Wrench,
  Broken: AlertTriangle,
  Lost: CircleOff,
} satisfies Record<Device['status'], typeof CheckCircle>;

function SkeletonCard() {
  return <div className="h-32 rounded-2xl bg-ivory-300 dark:bg-navy-800 animate-pulse" />;
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { devices, loading, error } = useDevices();
  const ArrowIcon = i18n.language === 'ar' ? ArrowLeft : ArrowRight;

  const statusCounts = useMemo(() => {
    return DEVICE_STATUSES.reduce<Record<Device['status'], number>>((acc, s) => {
      acc[s] = devices.filter((d) => d.status === s).length;
      return acc;
    }, { Working: 0, Maintenance: 0, Broken: 0, Lost: 0 });
  }, [devices]);

  const totalDevices = devices.length;

  const healthScore = totalDevices
    ? Math.round((statusCounts.Working / totalDevices) * 100)
    : 0;

  const devicesThisMonth = useMemo(() => {
    const now = new Date();
    return devices.filter((d) => {
      const created = new Date(d.created_at);
      return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
    }).length;
  }, [devices]);

  const stats = [
    {
      label: t('total_devices'),
      value: totalDevices,
      icon: MonitorSmartphone,
      color: 'text-gold-600 dark:text-gold-400',
      bg: 'bg-gold-500/10',
      border: 'hover:border-gold-500/40',
      to: '/devices',
    },
    ...DEVICE_STATUSES.map((s) => {
      const tone = getStatusTone(s);
      return {
        label: t(getStatusLabelKey(s)),
        value: statusCounts[s],
        icon: statusIcons[s],
        color: tone.text,
        bg: tone.bg,
        border: tone.border,
        to: `/devices?status=${s}`,
      };
    }),
  ];

  const chartData = DEVICE_STATUSES.map((s) => {
    const count = statusCounts[s];
    return {
      status: s,
      name: t(getStatusLabelKey(s)),
      value: count,
      percentage: totalDevices ? Math.round((count / totalDevices) * 100) : 0,
      color: getStatusTone(s).color,
    };
  }).filter((d) => d.value > 0);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    devices.forEach((d) => { counts[d.category] = (counts[d.category] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [devices]);

  const recentDevices = useMemo(() => {
    return [...devices]
      .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
      .slice(0, 8);
  }, [devices]);

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="h-10 w-64 rounded-xl bg-ivory-300 dark:bg-navy-800 animate-pulse" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-80 rounded-2xl bg-ivory-300 dark:bg-navy-800 animate-pulse" />
          <div className="h-80 rounded-2xl bg-ivory-300 dark:bg-navy-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 shadow-xs">
        <p className="text-lg font-bold">{t('error')}</p>
        <p className="mt-1 text-sm font-medium">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Banner Header */}
      <div className="surface-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-gold-500/20 bg-gradient-to-r from-white via-ivory-100 to-gold-50/30 dark:from-navy-900 dark:via-navy-900 dark:to-navy-800/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-700 dark:text-gold-400 text-xs font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            مركز قيادة المخزون الحكومي
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            مرحباً بك في بيت الثقافة بحائل
          </h1>
          <p className="text-sm font-medium text-navy-500 dark:text-navy-300 max-w-xl">
            نظرة عامة على حالة وتوزيع الأصول والمعدات الرقمية المحصاة في المركز.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/devices" className="btn-gold">
            <MonitorSmartphone className="w-4 h-4" />
            <span>عرض كافة الأجهزة</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className={`surface-card surface-card-hover p-5 flex flex-col justify-between ${stat.border}`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-navy-600 dark:text-navy-300 truncate">{stat.label}</span>
              <div className={`p-2 rounded-xl shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">{stat.value}</p>
            {totalDevices > 0 && (
              <p className="text-[11px] font-semibold text-navy-400 mt-1">
                النسبة: {totalDevices > 0 ? Math.round((stat.value / totalDevices) * 100) : 0}%
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Health Gauge & This Month Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Health Score */}
        <div className="surface-card p-6 flex items-center gap-6">
          <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90" aria-hidden="true">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3"
                className="text-ivory-300 dark:text-navy-800" />
              <circle
                cx="18" cy="18" r="15.9" fill="none" strokeWidth="3"
                stroke={healthScore > 70 ? '#C5943A' : healthScore > 40 ? '#A87A2E' : '#F43F5E'}
                strokeDasharray={`${healthScore} 100`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute text-xl font-extrabold text-navy-900 dark:text-white">{healthScore}%</span>
          </div>
          <div>
            <p className="text-xs font-extrabold text-navy-400 uppercase tracking-widest mb-1">{t('health_score')}</p>
            <p className="text-xl font-extrabold text-navy-900 dark:text-white leading-tight">
              {statusCounts.Working} {t('working')}
            </p>
            <p className="text-xs text-navy-500 font-semibold mt-1">
              من إجمالي {totalDevices} جهاز مسجل في النظام
            </p>
          </div>
        </div>

        {/* Devices Added This Month */}
        <div className="surface-card p-6 flex items-center gap-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-gradient text-white shadow-gold shrink-0">
            <CalendarDays className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-navy-400 uppercase tracking-widest mb-1">{t('devices_this_month')}</p>
            <p className="text-3xl font-extrabold text-navy-900 dark:text-white">{devicesThisMonth}</p>
            <p className="text-xs text-navy-500 font-semibold mt-1">
              {new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Donut Chart */}
        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-extrabold text-navy-900 dark:text-white">{t('device_status_distribution')}</h2>
              <p className="text-xs font-semibold text-navy-400 mt-0.5">
                إجمالي الأجهزة: <span className="font-bold text-gold-600 dark:text-gold-400">{totalDevices}</span>
              </p>
            </div>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-ivory-300 dark:border-navy-800 text-sm font-medium text-navy-400">
              {t('no_data')}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr] items-center">
              <div className="h-56 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius="58%"
                      outerRadius="82%"
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.status} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _name, item) => {
                        const p = item.payload as (typeof chartData)[number];
                        return [`${value} (${p.percentage}%)`, p.name];
                      }}
                      contentStyle={{
                        backgroundColor: '#0A1220',
                        borderColor: '#172844',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '8px 14px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-navy-900 dark:text-white">{totalDevices}</span>
                  <span className="text-[10px] text-navy-400 font-bold">جهاز</span>
                </div>
              </div>

              <div className="space-y-2">
                {chartData.map((entry) => (
                  <Link
                    key={entry.status}
                    to={`/devices?status=${entry.status}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-ivory-300/80 dark:border-navy-800 p-3 text-sm font-bold transition-all duration-200 hover:bg-ivory-100 dark:hover:bg-navy-800/60 hover:border-gold-500/30"
                  >
                    <span className="flex items-center gap-2 text-navy-800 dark:text-ivory-200 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="truncate">{entry.name}</span>
                    </span>
                    <span className="font-extrabold text-navy-900 dark:text-white shrink-0 text-sm">
                      {entry.value}
                      <span className="text-[10px] text-navy-400 font-normal ml-1">({entry.percentage}%)</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Horizontal Bar Chart */}
        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-extrabold text-navy-900 dark:text-white">{t('devices_by_category')}</h2>
              <p className="text-xs font-semibold text-navy-400 mt-0.5">{categoryData.length} فئة رئيسية</p>
            </div>
            <Link to="/categories" className="inline-flex items-center gap-1 text-xs font-extrabold text-gold-600 dark:text-gold-400 hover:underline">
              عرض الكتالوج <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {categoryData.length === 0 ? (
            <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-ivory-300 dark:border-navy-800 text-sm font-medium text-navy-400">
              {t('no_data')}
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(v) => [v, 'أجهزة']}
                    contentStyle={{
                      backgroundColor: '#0A1220',
                      borderColor: '#172844',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  />
                  <Bar dataKey="value" fill="#C5943A" radius={[0, 6, 6, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recently Updated Devices */}
      <div className="surface-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-extrabold text-navy-900 dark:text-white">{t('recently_modified')}</h2>
            <p className="text-xs font-semibold text-navy-400 mt-0.5">آخر الأجهزة المحدثة أو المضافة مؤخراً</p>
          </div>
          <Link to="/devices" className="inline-flex items-center gap-1 text-xs font-extrabold text-gold-600 dark:text-gold-400 hover:underline">
            السجل الكامل <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDevices.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-ivory-300 dark:border-navy-800 text-sm font-medium text-navy-400">
            {t('no_data')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {recentDevices.map((device) => (
              <Link
                key={device.id}
                to={`/devices/${device.id}`}
                className="group flex flex-col justify-between gap-3 p-4 rounded-xl border border-ivory-300/80 dark:border-navy-800 bg-ivory-50/50 dark:bg-navy-800/30 hover:border-gold-500/40 hover:bg-white dark:hover:bg-navy-800 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-extrabold text-navy-900 dark:text-white text-sm truncate leading-tight group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    {device.name}
                  </p>
                  <span className={`shrink-0 px-2 py-0.5 text-[10px] font-extrabold rounded-full ${getStatusBadgeClass(device.status)}`}>
                    {t(getStatusLabelKey(device.status))}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-ivory-200 dark:bg-navy-700 text-navy-700 dark:text-ivory-200">
                    {device.inventory_code}
                  </span>
                  <time className="text-[10px] text-navy-400 font-semibold" dateTime={device.updated_at}>
                    {new Intl.DateTimeFormat('ar-SA', { month: 'numeric', day: 'numeric' }).format(new Date(device.updated_at || device.created_at))}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
