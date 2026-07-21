import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Loader2, MonitorSmartphone, Calendar, MapPin, Hash, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import type { Device } from '../hooks/useDevices';
import { DEVICE_STATUSES, getStatusLabelKey } from '../lib/deviceUtils';
import { getErrorMessage } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { logActivity } from '../hooks/useActivityLog';

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/90 dark:bg-navy-800/80 dark:border-navy-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all duration-200';

export default function DeviceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isNew = !id || id === 'new';

  const [device, setDevice] = useState<Partial<Device>>({ status: 'Working' });
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
    if (!device.name?.trim()) { toast.error('اسم الجهاز مطلوب'); return; }
    if (!device.category?.trim()) { toast.error('الفئة مطلوبة'); return; }
    if (!device.inventory_code?.trim()) { toast.error('رمز الجرد مطلوب'); return; }

    setSaving(true);
    try {
      if (isNew) {
        const { data, error } = await supabase.from('devices').insert([device]).select().single();
        if (error) throw error;
        await logActivity({
          userId: user?.id ?? null,
          action: 'device_created',
          entityType: 'device',
          entityId: data?.id,
          details: { name: device.name, inventory_code: device.inventory_code, category: device.category },
        });
      } else {
        const { error } = await supabase.from('devices').update(device).eq('id', id);
        if (error) throw error;
        await logActivity({
          userId: user?.id ?? null,
          action: 'device_updated',
          entityType: 'device',
          entityId: id,
          details: { name: device.name, status: device.status },
        });
      }
      toast.success(t('success'));
      navigate('/devices');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-200/80 dark:border-navy-800">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-navy-800 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-7 w-48 rounded-xl bg-slate-200 dark:bg-navy-800 animate-pulse" />
            <div className="h-4 w-32 rounded-lg bg-slate-200 dark:bg-navy-800 animate-pulse" />
          </div>
        </div>
        <div className="glass-card rounded-2xl p-8 grid grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-navy-800 animate-pulse" />
              <div className="h-11 rounded-xl bg-slate-200 dark:bg-navy-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200/80 dark:border-navy-800">
        <button
          type="button"
          onClick={() => navigate('/devices')}
          className="p-2 text-slate-500 hover:text-navy-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors shrink-0"
          aria-label={t('back_home')}
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            {isNew ? t('add_device') : t('edit')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isNew ? 'إضافة جهاز جديد إلى سجل المخزون' : `تعديل: ${device.name || ''}`}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Section: Device Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-navy-800">
            <div className="p-2 rounded-xl bg-gold-50 dark:bg-gold-950/40 text-gold-600 dark:text-gold-400">
              <MonitorSmartphone className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-sm font-bold text-navy-900 dark:text-white">{t('device_info')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldGroup label={t('name')}>
              <input
                type="text" name="name"
                value={device.name || ''} onChange={handleChange}
                placeholder="مثال: شاشة تفاعلية 65 بوصة"
                className={inputClass}
              />
            </FieldGroup>

            <FieldGroup label={t('inventory_code')}>
              <input
                type="text" name="inventory_code"
                value={device.inventory_code || ''} onChange={handleChange}
                placeholder="مثال: HCH-SCR-001"
                className={`${inputClass} font-mono`}
              />
            </FieldGroup>

            <FieldGroup label={t('category')}>
              <input
                type="text" name="category"
                value={device.category || ''} onChange={handleChange}
                placeholder="مثال: شاشات وعرض"
                className={inputClass}
              />
            </FieldGroup>

            <FieldGroup label={t('status')}>
              <select
                name="status"
                value={device.status || 'Working'} onChange={handleChange}
                className={inputClass}
              >
                {DEVICE_STATUSES.map((s) => (
                  <option key={s} value={s}>{t(getStatusLabelKey(s))}</option>
                ))}
              </select>
            </FieldGroup>

            <FieldGroup label={t('brand')}>
              <input
                type="text" name="brand"
                value={device.brand || ''} onChange={handleChange}
                placeholder="مثال: Samsung"
                className={inputClass}
              />
            </FieldGroup>

            <FieldGroup label={t('model')}>
              <input
                type="text" name="model"
                value={device.model || ''} onChange={handleChange}
                placeholder="مثال: QN65Q80C"
                className={inputClass}
              />
            </FieldGroup>
          </div>
        </div>

        {/* Section: Additional Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-navy-800">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400">
              <Info className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-sm font-bold text-navy-900 dark:text-white">{t('additional_info')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldGroup label={t('serial_number')}>
              <div className="relative">
                <Hash className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text" name="serial_number"
                  value={device.serial_number || ''} onChange={handleChange}
                  placeholder="S/N"
                  className={`${inputClass} pl-10 rtl:pl-4 rtl:pr-10 font-mono`}
                />
              </div>
            </FieldGroup>

            <FieldGroup label={t('location')}>
              <div className="relative">
                <MapPin className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text" name="location"
                  value={device.location || ''} onChange={handleChange}
                  placeholder="مثال: قاعة المؤتمرات"
                  className={`${inputClass} pl-10 rtl:pl-4 rtl:pr-10`}
                />
              </div>
            </FieldGroup>

            <FieldGroup label={t('purchase_date')}>
              <div className="relative">
                <Calendar className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date" name="purchase_date"
                  value={device.purchase_date || ''} onChange={handleChange}
                  className={`${inputClass} pl-10 rtl:pl-4 rtl:pr-10`}
                />
              </div>
            </FieldGroup>

            <FieldGroup label={t('warranty_expiry')}>
              <div className="relative">
                <Calendar className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date" name="warranty_expiry"
                  value={device.warranty_expiry || ''} onChange={handleChange}
                  className={`${inputClass} pl-10 rtl:pl-4 rtl:pr-10`}
                />
              </div>
            </FieldGroup>

            <div className="md:col-span-2">
              <FieldGroup label={t('notes')}>
                <textarea
                  name="notes" rows={3}
                  value={device.notes || ''} onChange={handleChange}
                  placeholder="ملاحظات إضافية عن الجهاز..."
                  className={`${inputClass} resize-none`}
                />
              </FieldGroup>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center pt-4 border-t border-slate-100 dark:border-navy-800 gap-3">
          <button
            type="button"
            onClick={() => navigate('/devices')}
            className="btn-outline"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-gold"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('saving')}</span></>
            ) : (
              <><Save className="w-4 h-4" /><span>{t('save')}</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
