import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Eye, Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDevices, type Device } from '../hooks/useDevices';
import { supabase } from '../lib/supabase';
import { DEVICE_STATUSES, getStatusBadgeClass, getStatusLabelKey } from '../lib/deviceUtils';
import { getErrorMessage } from '../lib/utils';

export default function Devices() {
  const { t } = useTranslation();
  const { devices, loading, error, refetch } = useDevices();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const selectedStatus = searchParams.get('status') || '';
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const categories = useMemo(() => {
    return Array.from(new Set(devices.map((device) => device.category).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [devices]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirm_delete'))) return;

    try {
      const { error } = await supabase.from('devices').delete().eq('id', id);
      if (error) throw error;
      toast.success(t('success'));
      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const filteredDevices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return devices.filter((device) => {
      const matchesSearch =
        !normalizedSearch ||
        device.name.toLowerCase().includes(normalizedSearch) ||
        device.inventory_code.toLowerCase().includes(normalizedSearch) ||
        device.category.toLowerCase().includes(normalizedSearch);
      const matchesStatus = !selectedStatus || device.status === selectedStatus;
      const matchesCategory = !selectedCategory || device.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [devices, searchTerm, selectedCategory, selectedStatus]);

  const hasFilters = Boolean(searchTerm || selectedStatus || selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('devices')}</h1>
        <Link
          to="/devices/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          {t('add_device')}
        </Link>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              updateFilter('search', e.target.value);
            }}
            className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[180px_220px_auto]">
          <label className="sr-only" htmlFor="status-filter">
            {t('status_filter')}
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(event) => updateFilter('status', event.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{t('all_statuses')}</option>
            {DEVICE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(getStatusLabelKey(status))}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="category-filter">
            {t('category_filter')}
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => updateFilter('category', event.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{t('all_categories')}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
            {t('clear_filters')}
          </button>
        </div>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Filter className="h-4 w-4" />
          <span className="font-medium">{t('active_filters')}:</span>
          {searchTerm && (
            <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700">
              {t('search_label')}: {searchTerm}
            </span>
          )}
          {selectedStatus && (
            <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700">
              {t('status')}: {t(getStatusLabelKey(selectedStatus as Device['status']))}
            </span>
          )}
          {selectedCategory && (
            <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700">
              {t('category')}: {selectedCategory}
            </span>
          )}
          <span className="text-gray-500 dark:text-gray-400">
            {filteredDevices.length} / {devices.length}
          </span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">{t('inventory_code')}</th>
                <th className="px-6 py-4 font-medium">{t('name')}</th>
                <th className="px-6 py-4 font-medium">{t('category')}</th>
                <th className="px-6 py-4 font-medium">{t('status')}</th>
                <th className="px-6 py-4 font-medium">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    {t('loading')}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-600 dark:text-red-400">
                    {error.message}
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    {t('no_data')}
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{device.inventory_code}</td>
                    <td className="px-6 py-4">{device.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {device.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(device.status)}`}>
                        {t(getStatusLabelKey(device.status))}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/devices/${device.id}`}
                          className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                          aria-label={`${t('devices')}: ${device.name}`}
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/devices/${device.id}/edit`}
                          className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          aria-label={`${t('edit')}: ${device.name}`}
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(device.id)}
                          className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          aria-label={`${t('delete')}: ${device.name}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
