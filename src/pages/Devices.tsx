import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Edit, Eye, Filter, Plus, Search, Trash2, X, Tag,
  Upload, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDevices, type Device } from '../hooks/useDevices';
import { supabase } from '../lib/supabase';
import { DEVICE_STATUSES, getStatusBadgeClass, getStatusLabelKey } from '../lib/deviceUtils';
import { getErrorMessage } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { logActivity } from '../hooks/useActivityLog';
import ImportDevicesModal from '../components/ImportDevicesModal';

type SortKey = 'inventory_code' | 'name' | 'category' | 'status' | 'location' | 'updated_at';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 25;

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-gold-500" />
    : <ChevronDown className="w-3.5 h-3.5 text-gold-500" />;
}

export default function Devices() {
  const { t } = useTranslation();
  const { devices, loading, error, refetch } = useDevices();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortKey, setSortKey] = useState<SortKey>('updated_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [showImport, setShowImport] = useState(false);

  const selectedStatus = searchParams.get('status') || '';
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setPage(1);
  }, [searchParams]);

  const categories = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.category).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [devices]);

  const locations = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.location).filter(Boolean) as string[])).sort();
  }, [devices]);

  const selectedLocation = searchParams.get('location') || '';

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setPage(1);
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPage(1);
    setSearchParams({});
  };

  const handleSort = (col: SortKey) => {
    if (sortKey === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleDelete = async (device: Device) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      const { error } = await supabase.from('devices').delete().eq('id', device.id);
      if (error) throw error;
      toast.success(t('success'));
      // Log activity
      await logActivity({
        userId: user?.id ?? null,
        action: 'device_deleted',
        entityType: 'device',
        entityId: device.id,
        details: { name: device.name, inventory_code: device.inventory_code },
      });
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const filteredDevices = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    return devices.filter((d) => {
      const matchSearch =
        !s ||
        d.name.toLowerCase().includes(s) ||
        d.inventory_code.toLowerCase().includes(s) ||
        d.category.toLowerCase().includes(s) ||
        (d.brand ?? '').toLowerCase().includes(s) ||
        (d.location ?? '').toLowerCase().includes(s);
      const matchStatus = !selectedStatus || d.status === selectedStatus;
      const matchCategory = !selectedCategory || d.category === selectedCategory;
      const matchLocation = !selectedLocation || d.location === selectedLocation;
      return matchSearch && matchStatus && matchCategory && matchLocation;
    });
  }, [devices, searchTerm, selectedCategory, selectedStatus, selectedLocation]);

  const sortedDevices = useMemo(() => {
    return [...filteredDevices].sort((a, b) => {
      const av = (a[sortKey] ?? '') as string;
      const bv = (b[sortKey] ?? '') as string;
      const cmp = av.localeCompare(bv, undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredDevices, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedDevices.length / PAGE_SIZE));
  const pagedDevices = sortedDevices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = Boolean(searchTerm || selectedStatus || selectedCategory || selectedLocation);

  const thClass = (col: SortKey) =>
    `px-5 py-3.5 text-left rtl:text-right whitespace-nowrap font-semibold cursor-pointer select-none group transition-colors hover:text-gold-600 dark:hover:text-gold-400 ${sortKey === col ? 'text-gold-600 dark:text-gold-400' : ''}`;

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            {t('devices')}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            سجل وتفاصيل أجهزة ومعدات بيت الثقافة
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl border border-gold-500/30 bg-gold-500/8 text-gold-700 dark:text-gold-400 hover:bg-gold-500/15 hover:border-gold-500/50 transition-all duration-200"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">{t('import_devices')}</span>
          </button>
          <Link
            to="/devices/new"
            className="btn-gold"
          >
            <Plus className="w-4 h-4" />
            <span>{t('add_device')}</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col gap-3 xl:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              updateFilter('search', e.target.value);
            }}
            className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 dark:bg-navy-800/80 dark:border-navy-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all duration-200"
          />
        </div>

        <div className="flex flex-wrap gap-2.5">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/80 dark:bg-navy-800/80 dark:border-navy-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm font-medium transition-all duration-200"
          >
            <option value="">{t('all_statuses')}</option>
            {DEVICE_STATUSES.map((s) => (
              <option key={s} value={s}>{t(getStatusLabelKey(s))}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/80 dark:bg-navy-800/80 dark:border-navy-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm font-medium transition-all duration-200"
          >
            <option value="">{t('all_categories')}</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Location Filter */}
          {locations.length > 0 && (
            <select
              value={selectedLocation}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white/80 dark:bg-navy-800/80 dark:border-navy-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm font-medium transition-all duration-200"
            >
              <option value="">{t('all_locations')}</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          )}

          {/* Clear */}
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white dark:bg-navy-800 dark:border-navy-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200"
          >
            <X className="w-4 h-4" />
            <span>{t('clear_filters')}</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-semibold text-gold-600 dark:text-gold-400 text-xs">
            <Filter className="h-3.5 w-3.5" />
            {t('active_filters')}:
          </span>
          {[
            searchTerm && { label: `${t('search_label')}: ${searchTerm}` },
            selectedStatus && { label: `${t('status')}: ${t(getStatusLabelKey(selectedStatus as Device['status']))}` },
            selectedCategory && { label: `${t('category')}: ${selectedCategory}` },
            selectedLocation && { label: `${t('location')}: ${selectedLocation}` },
          ].filter(Boolean).map((chip, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-gold-50 dark:bg-gold-950/40 border border-gold-200 dark:border-gold-800 px-3 py-1 text-xs font-bold text-gold-800 dark:text-gold-300">
              {(chip as { label: string }).label}
            </span>
          ))}
          <span className="text-xs font-medium text-slate-400">
            ({filteredDevices.length} / {devices.length})
          </span>
        </div>
      )}

      {/* Table Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className={thClass('inventory_code')} onClick={() => handleSort('inventory_code')}>
                  <span className="inline-flex items-center gap-1.5">
                    {t('inventory_code')} <SortIcon col="inventory_code" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th className={thClass('name')} onClick={() => handleSort('name')}>
                  <span className="inline-flex items-center gap-1.5">
                    {t('name')} <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th className={thClass('category')} onClick={() => handleSort('category')}>
                  <span className="inline-flex items-center gap-1.5">
                    {t('category')} <SortIcon col="category" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th className={thClass('location')} onClick={() => handleSort('location')}>
                  <span className="inline-flex items-center gap-1.5">
                    {t('location')} <SortIcon col="location" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th className={thClass('status')} onClick={() => handleSort('status')}>
                  <span className="inline-flex items-center gap-1.5">
                    {t('status')} <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th className="px-5 py-3.5 text-left rtl:text-right whitespace-nowrap font-semibold">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded-lg bg-slate-200 dark:bg-navy-700 animate-pulse" style={{ width: `${60 + (j * 20) % 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-rose-600 dark:text-rose-400 font-medium">
                    {error.message}
                  </td>
                </tr>
              ) : pagedDevices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-navy-800 flex items-center justify-center">
                        <Search className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="font-semibold text-sm">{t('no_data')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedDevices.map((device) => (
                  <tr key={device.id}>
                    <td>
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold border border-slate-200/60 dark:border-navy-700">
                        {device.inventory_code}
                      </span>
                    </td>
                    <td className="font-bold text-navy-900 dark:text-white">
                      {device.name}
                      {device.brand && (
                        <span className="block text-[10px] font-medium text-slate-400 leading-tight mt-0.5">{device.brand}</span>
                      )}
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300 border border-slate-200 dark:border-navy-700">
                        <Tag className="w-3 h-3 text-gold-500" />
                        {device.category}
                      </span>
                    </td>
                    <td className="text-sm text-slate-500 dark:text-slate-400">
                      {device.location || <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(device.status)}`}>
                        {t(getStatusLabelKey(device.status))}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/devices/${device.id}`}
                          className="p-1.5 text-slate-400 hover:text-gold-600 dark:hover:text-gold-400 rounded-lg hover:bg-gold-50 dark:hover:bg-gold-950/30 transition-colors"
                          title={t('view')}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/devices/${device.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                          title={t('edit')}
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(device)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagedDevices.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-950/30">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t('showing')} {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sortedDevices.length)} {t('of')} {sortedDevices.length} {t('results')}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${page === p ? 'bg-gold-500 text-white shadow-gold-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImport && (
        <ImportDevicesModal
          onClose={() => setShowImport(false)}
          onSuccess={() => {
            setShowImport(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
