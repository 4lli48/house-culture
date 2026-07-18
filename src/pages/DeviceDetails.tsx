import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import type { Device } from '../hooks/useDevices';
import { DEVICE_STATUSES, getStatusLabelKey } from '../lib/deviceUtils';
import { getErrorMessage } from '../lib/utils';

export default function DeviceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isNew = !id || id === 'new';
  
  const [device, setDevice] = useState<Partial<Device>>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const fetchDevice = async () => {
        try {
          const { data, error } = await supabase.from('devices').select('*').eq('id', id).single();
          if (error) throw error;
          setDevice(data);
        } catch (error) {
          toast.error(getErrorMessage(error));
        } finally {
          setLoading(false);
        }
      };
      fetchDevice();
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const { error } = await supabase.from('devices').insert([device]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('devices').update(device).eq('id', id);
        if (error) throw error;
      }
      toast.success(t('success'));
      navigate('/devices');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>{t('loading')}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/devices')}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800"
          aria-label={t('back_home')}
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isNew ? t('add_device') : t('edit')}
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')}</label>
            <input type="text" name="name" value={device.name || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('inventory_code')}</label>
            <input type="text" name="inventory_code" value={device.inventory_code || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('category')}</label>
            <input type="text" name="category" value={device.category || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('status')}</label>
            <select name="status" value={device.status || 'Working'} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {DEVICE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {t(getStatusLabelKey(status))}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t dark:border-gray-700 gap-3">
          <button type="button" onClick={() => navigate('/devices')} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600">
            {t('cancel')}
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
