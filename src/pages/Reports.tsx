import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, Download, Folder, MonitorSmartphone, Loader2, FileSpreadsheet, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { useDevices } from '../hooks/useDevices';
import { DEVICE_STATUSES, getStatusLabelKey, getStatusTone } from '../lib/deviceUtils';
import type { Device } from '../hooks/useDevices';

export default function Reports() {
  const { t } = useTranslation();
  const { devices, loading, error } = useDevices();

  const statusRows = useMemo(() => {
    return DEVICE_STATUSES.map((status) => {
      const count = devices.filter((d) => d.status === status).length;
      return {
        status,
        count,
        percentage: devices.length ? Math.round((count / devices.length) * 100) : 0,
        tone: getStatusTone(status),
      };
    });
  }, [devices]);

  const categoryRows = useMemo(() => {
    const counts = devices.reduce<Record<string, number>>((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [devices]);

  const locationRows = useMemo(() => {
    const counts = devices.reduce<Record<string, number>>((acc, d) => {
      if (d.location) acc[d.location] = (acc[d.location] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);
  }, [devices]);

  // ── Export CSV ──────────────────────────────────────────────────────────────
  const exportCsv = () => {
    const headers = ['inventory_code', 'name', 'category', 'status', 'brand', 'model', 'location', 'serial_number', 'purchase_date', 'warranty_expiry', 'notes', 'created_at', 'updated_at'];
    const rows = devices.map((d) =>
      headers.map((key) => {
        const value = String(d[key as keyof Device] ?? '');
        return `"${value.replace(/"/g, '""')}"`;
      }).join(',')
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hch-devices-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Export Excel ────────────────────────────────────────────────────────────
  const exportExcel = () => {
    const headers = {
      inventory_code: 'رمز الجرد',
      name: 'الاسم',
      category: 'الفئة',
      status: 'الحالة',
      brand: 'العلامة التجارية',
      model: 'الطراز',
      location: 'الموقع',
      serial_number: 'الرقم التسلسلي',
      purchase_date: 'تاريخ الشراء',
      warranty_expiry: 'انتهاء الضمان',
      notes: 'ملاحظات',
      created_at: 'تاريخ الإنشاء',
      updated_at: 'آخر تعديل',
    };

    const data = devices.map((d) =>
      Object.fromEntries(
        Object.entries(headers).map(([key, label]) => [label, d[key as keyof Device] ?? ''])
      )
    );

    const ws = XLSX.utils.json_to_sheet(data);

    // Column widths
    ws['!cols'] = Object.keys(headers).map((k) => ({
      wch: k === 'name' || k === 'notes' ? 30 : k === 'inventory_code' ? 18 : 16,
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الأجهزة');
    XLSX.writeFile(wb, `hch-devices-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            {t('reports')}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {t('reports_description')}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <button
            type="button"
            onClick={exportCsv}
            disabled={devices.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-700 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>{t('export_csv')}</span>
          </button>
          <button
            type="button"
            onClick={exportExcel}
            disabled={devices.length === 0}
            className="btn-gold"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{t('export_excel')}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
          <span className="text-sm font-medium text-slate-400">{t('loading')}</span>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl text-rose-600 dark:text-rose-400 font-medium">
          {error.message}
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-card p-6 rounded-2xl">
              <div className="p-2.5 rounded-xl bg-gold-50 dark:bg-gold-950/40 text-gold-600 dark:text-gold-400 w-fit mb-4">
                <MonitorSmartphone className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('total_devices')}</p>
              <p className="text-3xl font-extrabold text-navy-900 dark:text-white mt-1">{devices.length}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 w-fit mb-4">
                <Folder className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('categories')}</p>
              <p className="text-3xl font-extrabold text-navy-900 dark:text-white mt-1">{categoryRows.length}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 w-fit mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('working')}</p>
              <p className="text-3xl font-extrabold text-navy-900 dark:text-white mt-1">
                {statusRows.find((r) => r.status === 'Working')?.count || 0}
              </p>
            </div>
          </div>

          {/* Category Bar Chart */}
          {categoryRows.length > 0 && (
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-base font-extrabold text-navy-900 dark:text-white mb-5">{t('category_report')}</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryRows.slice(0, 10)} margin={{ left: 0, right: 8, top: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                      angle={-30} textAnchor="end" interval={0}
                      tickLine={false} axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      formatter={(v) => [v, t('total_devices')]}
                      contentStyle={{ backgroundColor: '#0B1124', borderColor: '#1E2C4D', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: '700' }}
                    />
                    <Bar dataKey="count" fill="#C5A059" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Status Breakdown */}
            <div className="glass-card p-6 rounded-2xl space-y-5">
              <h2 className="text-base font-extrabold text-navy-900 dark:text-white">{t('status_report')}</h2>
              <div className="space-y-4">
                {statusRows.map((row) => (
                  <Link key={row.status} to={`/devices?status=${row.status}`} className="block group">
                    <div className="flex items-center justify-between text-sm font-semibold mb-1.5">
                      <span className="text-slate-700 dark:text-slate-200 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                        {t(getStatusLabelKey(row.status))}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {row.count} ({row.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-navy-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${row.percentage}%`, backgroundColor: row.tone.color }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Location Breakdown */}
            <div className="glass-card p-6 rounded-2xl space-y-5">
              <h2 className="text-base font-extrabold text-navy-900 dark:text-white">{t('location_report')}</h2>
              {locationRows.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-navy-700 text-sm font-medium text-slate-400">
                  {t('no_data')}
                </div>
              ) : (
                <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
                  {locationRows.map((row) => (
                    <Link
                      key={row.location}
                      to={`/devices?location=${encodeURIComponent(row.location)}`}
                      className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-navy-800 p-3.5 text-sm font-semibold transition-all duration-200 hover:bg-slate-50 dark:hover:bg-navy-800 hover:border-gold-500/30"
                    >
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200 truncate">
                        <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                        <span className="truncate">{row.location}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-700 text-slate-800 dark:text-gold-400 text-xs font-extrabold font-mono shrink-0">
                        {row.count}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
