import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Loader2, Wrench } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../lib/utils';

interface AddLogModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLogModal({ onClose, onSuccess }: AddLogModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [actionType, setActionType] = useState('maintenance_note');
  const [deviceName, setDeviceName] = useState('');
  const [inventoryCode, setInventoryCode] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      toast.error('يرجى كتابة تفاصيل السجل أو الملاحظة');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('activity_logs').insert({
        user_id: user?.id ?? null,
        action: actionType,
        entity_type: 'manual_log',
        details: {
          name: deviceName.trim() || undefined,
          inventory_code: inventoryCode.trim() || undefined,
          note: note.trim(),
        },
      });

      if (error) throw error;
      toast.success(t('success'));
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-fade-in">
      <div className="surface-card w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border-gold-500/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-navy-900 dark:text-white">
                إضافة سجل نشاط / صيانة
              </h2>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                إدخال ملاحظة صيانة أو نشاط يدوي إلى سجلات النظام
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-navy-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              نوع السجل / الإجراء
            </label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
            >
              <option value="maintenance_note">صيانة وإصلاح (Maintenance Note)</option>
              <option value="inspection">فحص ومعاينة (Inspection)</option>
              <option value="status_changed">تحديث حالة يدوي (Status Log)</option>
              <option value="administrative">ملاحظة إدارية (Admin Note)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                اسم الجهاز (اختياري)
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="مثال: طابعة ليزر ملونة"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                رمز الجرد (اختياري)
              </label>
              <input
                type="text"
                value={inventoryCode}
                onChange={(e) => setInventoryCode(e.target.value)}
                placeholder="HCH-PRT-002"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              تفاصيل النشاط أو الملاحظة *
            </label>
            <textarea
              rows={4}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب تفاصيل الصيانة أو الإجراء المتخذ..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline px-5 py-2.5 text-xs rounded-2xl"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold px-6 py-2.5 text-xs gap-2 rounded-2xl"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('saving')}</span></>
              ) : (
                <><Plus className="w-4 h-4" /><span>إضافة السجل</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
