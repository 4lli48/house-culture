import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, CheckCircle, AlertTriangle, FileSpreadsheet, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../lib/utils';
import { DEVICE_STATUSES } from '../lib/deviceUtils';
import type { Device } from '../hooks/useDevices';
import { cn } from '../lib/utils';

interface ImportRow {
  row: number;
  name?: string;
  category?: string;
  inventory_code?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  location?: string;
  status?: string;
  notes?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  error?: string;
}

interface ImportResult {
  success: number;
  failed: number;
  duplicates: number;
  errors: { row: number; code: string; reason: string }[];
}

interface ImportDevicesModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportDevicesModal({ onClose, onSuccess }: ImportDevicesModalProps) {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload');

  const parseFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

        const parsed: ImportRow[] = json.map((raw, i) => {
          const row: ImportRow = {
            row: i + 2,
            name: String(raw['name'] || raw['الاسم'] || raw['Name'] || '').trim(),
            category: String(raw['category'] || raw['الفئة'] || raw['Category'] || '').trim(),
            inventory_code: String(raw['inventory_code'] || raw['رمز الجرد'] || raw['Inventory Code'] || '').trim(),
            brand: String(raw['brand'] || raw['العلامة التجارية'] || raw['Brand'] || '').trim(),
            model: String(raw['model'] || raw['الطراز'] || raw['Model'] || '').trim(),
            serial_number: String(raw['serial_number'] || raw['الرقم التسلسلي'] || raw['Serial Number'] || '').trim(),
            location: String(raw['location'] || raw['الموقع'] || raw['Location'] || '').trim(),
            status: String(raw['status'] || raw['الحالة'] || raw['Status'] || 'Working').trim(),
            notes: String(raw['notes'] || raw['ملاحظات'] || raw['Notes'] || '').trim(),
            purchase_date: String(raw['purchase_date'] || raw['تاريخ الشراء'] || '').trim() || undefined,
            warranty_expiry: String(raw['warranty_expiry'] || raw['انتهاء الضمان'] || '').trim() || undefined,
          };

          // Validate
          if (!row.name) row.error = t('import_required_missing') + ': name';
          else if (!row.category) row.error = t('import_required_missing') + ': category';
          else if (!row.inventory_code) row.error = t('import_required_missing') + ': inventory_code';
          else if (row.status && !DEVICE_STATUSES.includes(row.status as Device['status'])) {
            row.error = t('import_invalid_status') + `: "${row.status}"`;
          }

          return row;
        });

        setRows(parsed);
        setStep('preview');
      } catch {
        setRows([]);
        setStep('upload');
      }
    };
    reader.readAsArrayBuffer(file);
  }, [t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv') || file.name.endsWith('.xls'))) {
      parseFile(file);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    const validRows = rows.filter((r) => !r.error);
    const errorRows = rows.filter((r) => r.error);

    // Fetch existing inventory codes to check duplicates
    const { data: existing } = await supabase.from('devices').select('inventory_code');
    const existingCodes = new Set((existing || []).map((d) => d.inventory_code));

    const toInsert: Partial<Device>[] = [];
    const duplicates: ImportRow[] = [];

    for (const row of validRows) {
      if (existingCodes.has(row.inventory_code!)) {
        duplicates.push(row);
      } else {
        toInsert.push({
          name: row.name!,
          category: row.category!,
          inventory_code: row.inventory_code!,
          brand: row.brand || null,
          model: row.model || null,
          serial_number: row.serial_number || null,
          location: row.location || null,
          status: (DEVICE_STATUSES.includes(row.status as Device['status']) ? row.status : 'Working') as Device['status'],
          notes: row.notes || null,
          purchase_date: row.purchase_date || null,
          warranty_expiry: row.warranty_expiry || null,
        });
      }
    }

    let successCount = 0;
    const failedErrors: ImportResult['errors'] = [];

    if (toInsert.length > 0) {
      const { error } = await supabase.from('devices').insert(toInsert);
      if (error) {
        failedErrors.push({ row: 0, code: 'BATCH_ERROR', reason: getErrorMessage(error) });
      } else {
        successCount = toInsert.length;
      }
    }

    setResult({
      success: successCount,
      failed: errorRows.length + failedErrors.length,
      duplicates: duplicates.length,
      errors: [
        ...errorRows.map((r) => ({ row: r.row, code: r.inventory_code || '', reason: r.error! })),
        ...failedErrors,
      ],
    });
    setImporting(false);
    setStep('done');
    if (successCount > 0) onSuccess();
  };

  const validRows = rows.filter((r) => !r.error);
  const errorRows = rows.filter((r) => r.error);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-2xl bg-white dark:bg-navy-900 rounded-t-3xl sm:rounded-3xl border border-slate-200/80 dark:border-navy-700 shadow-2xl animate-fade-in-up max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-navy-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-gold-50 dark:bg-gold-950/40 text-gold-600 dark:text-gold-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-navy-900 dark:text-white">{t('import_excel')}</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{t('import_description')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* STEP: Upload */}
          {step === 'upload' && (
            <div
              className={cn('drop-zone', isDragging && 'drop-zone-active')}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <div className={cn('p-4 rounded-2xl transition-colors', isDragging ? 'bg-gold-100 dark:bg-gold-900/40' : 'bg-slate-100 dark:bg-navy-800')}>
                <Upload className={cn('w-8 h-8 transition-colors', isDragging ? 'text-gold-600' : 'text-slate-400')} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-navy-900 dark:text-white text-sm">{t('import_drop_hint')}</p>
                <p className="text-sm font-semibold text-gold-600 dark:text-gold-400 cursor-pointer hover:underline">
                  {t('import_browse')}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1">.xlsx, .xls, .csv</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Column mapping hint */}
          {step === 'upload' && (
            <div className="rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800/60 p-4">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                الأعمدة المطلوبة في الملف
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { key: 'name / الاسم', required: true },
                  { key: 'category / الفئة', required: true },
                  { key: 'inventory_code / رمز الجرد', required: true },
                  { key: 'brand / العلامة التجارية', required: false },
                  { key: 'model / الطراز', required: false },
                  { key: 'status / الحالة', required: false },
                  { key: 'location / الموقع', required: false },
                  { key: 'serial_number', required: false },
                  { key: 'notes / ملاحظات', required: false },
                ].map(({ key, required }) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs">
                    <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', required ? 'bg-gold-500' : 'bg-slate-300 dark:bg-slate-600')} />
                    <code className="font-mono text-[10px] text-slate-600 dark:text-slate-400 truncate">{key}</code>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">
                • القيم الصالحة للحالة: Working, Maintenance, Broken, Lost
              </p>
            </div>
          )}

          {/* STEP: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              {/* Summary chips */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {validRows.length} صف صالح
                </span>
                {errorRows.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {errorRows.length} خطأ
                  </span>
                )}
              </div>

              {/* Preview table */}
              <div className="rounded-xl border border-slate-200 dark:border-navy-700 overflow-hidden">
                <div className="overflow-x-auto max-h-64">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('name')}</th>
                        <th>{t('inventory_code')}</th>
                        <th>{t('category')}</th>
                        <th>{t('status')}</th>
                        <th>حالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.row} className={row.error ? 'bg-rose-50/60 dark:bg-rose-950/20' : ''}>
                          <td className="font-mono text-xs text-slate-400">{row.row}</td>
                          <td className="font-semibold text-navy-900 dark:text-white truncate max-w-[140px]">{row.name || '—'}</td>
                          <td className="font-mono text-xs">{row.inventory_code || '—'}</td>
                          <td>{row.category || '—'}</td>
                          <td>{row.status || '—'}</td>
                          <td>
                            {row.error ? (
                              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold line-clamp-2">{row.error}</span>
                            ) : (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP: Done */}
          {step === 'done' && result && (
            <div className="space-y-4 animate-fade-in">
              {result.success > 0 && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">
                      {t('import_success', { count: result.success })}
                    </p>
                  </div>
                </div>
              )}
              {result.duplicates > 0 && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    {t('import_duplicates', { count: result.duplicates })}
                  </p>
                </div>
              )}
              {result.errors.length > 0 && (
                <div className="rounded-xl border border-rose-200 dark:border-rose-800 overflow-hidden">
                  <div className="bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                      {t('import_errors', { count: result.errors.length })}
                    </p>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-2.5 border-t border-rose-100 dark:border-rose-900/50 text-xs">
                        <span className="font-mono text-slate-400">صف {err.row}</span>
                        <span className="font-semibold text-rose-600 dark:text-rose-400">{err.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-950/30 shrink-0 rounded-b-3xl">
          {step === 'upload' && (
            <button type="button" onClick={onClose} className="btn-outline">
              {t('cancel')}
            </button>
          )}

          {step === 'preview' && (
            <>
              <button
                type="button"
                onClick={() => { setRows([]); setStep('upload'); }}
                className="btn-outline"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={validRows.length === 0 || importing}
                className="btn-gold gap-2"
              >
                {importing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('importing')}</span></>
                ) : (
                  <><Upload className="w-4 h-4" /><span>{t('import_start')} ({validRows.length})</span></>
                )}
              </button>
            </>
          )}

          {step === 'done' && (
            <button type="button" onClick={onClose} className="btn-gold ml-auto">
              {t('import_close')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
