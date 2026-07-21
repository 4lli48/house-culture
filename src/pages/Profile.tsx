import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Shield, Save, Loader2, CheckCircle, User, Sliders, Moon, Sun, Globe, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { getErrorMessage, cn } from '../lib/utils';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') === 'settings' ? 'settings' : 'profile';

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Fetch current user full name from profiles
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (data?.full_name) {
        setFullName(data.full_name);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setSaveError('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() || null })
        .eq('id', user.id);
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const setTab = (tabName: 'profile' | 'settings') => {
    if (tabName === 'settings') {
      setSearchParams({ tab: 'settings' });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-ivory-300 dark:border-navy-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            {activeTab === 'settings' ? t('settings') : t('profile')}
          </h1>
          <p className="mt-0.5 text-sm text-navy-500 dark:text-navy-400">
            {activeTab === 'settings' ? 'تعديل تفضيلات المظهر واللغة' : 'إدارة بيانات الحساب والمعلومات الشخصية'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-ivory-100 dark:bg-navy-800 self-start sm:self-auto border border-ivory-300 dark:border-navy-700">
          <button
            type="button"
            onClick={() => setTab('profile')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200',
              activeTab === 'profile'
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-xs'
                : 'text-navy-600 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white'
            )}
          >
            <User className="w-4 h-4 text-gold-500" />
            <span>{t('profile')}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('settings')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200',
              activeTab === 'settings'
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-xs'
                : 'text-navy-600 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white'
            )}
          >
            <Sliders className="w-4 h-4 text-gold-500" />
            <span>{t('settings')}</span>
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        <div className="space-y-6">
          {/* Main Card */}
          <div className="surface-card p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gold-gradient text-white text-4xl font-extrabold shadow-gold-lg shrink-0">
                {userInitial}
                <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-900" />
              </div>

              <div className="text-center sm:text-start space-y-2 min-w-0">
                <h2 className="text-xl font-extrabold text-navy-900 dark:text-white truncate">
                  {fullName || user?.email?.split('@')[0]}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 text-xs font-bold border border-gold-500/20">
                    <Shield className="w-3.5 h-3.5 text-gold-500" />
                    {t('admin')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200 text-xs font-medium border border-ivory-300 dark:border-navy-700">
                    <Mail className="w-3.5 h-3.5 text-navy-400" />
                    <span className="truncate max-w-[200px]">{user?.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Form */}
            <div className="space-y-5 pt-6 border-t border-ivory-200 dark:border-navy-800">
              <div>
                <label className="block text-xs font-extrabold text-navy-700 dark:text-navy-300 uppercase tracking-wider mb-2">
                  {t('full_name')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full px-4 py-3 rounded-xl border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-navy-700 dark:text-navy-300 uppercase tracking-wider mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-ivory-200 dark:border-navy-800 bg-ivory-100 dark:bg-navy-900 text-navy-400 text-sm cursor-not-allowed opacity-70"
                />
                <p className="text-[11px] text-navy-400 font-semibold mt-1">البريد الإلكتروني مربوط بحساب الدخول الموحد</p>
              </div>

              {saveError && (
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{saveError}</p>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="btn-gold"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('saving')}</span></>
                  ) : saved ? (
                    <><CheckCircle className="w-4 h-4" /><span>{t('profile_updated')}</span></>
                  ) : (
                    <><Save className="w-4 h-4" /><span>{t('save')}</span></>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Additional details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="surface-card p-5">
              <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-1">{t('joined')}</p>
              <p className="text-sm font-extrabold text-navy-900 dark:text-white">
                {user?.created_at
                  ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(user.created_at))
                  : '—'}
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-1">الجهة التابع لها</p>
              <p className="text-sm font-extrabold text-navy-900 dark:text-white">بيت الثقافة بحائل</p>
            </div>
          </div>
        </div>
      ) : (
        /* Settings Tab */
        <div className="surface-card divide-y divide-ivory-200 dark:divide-navy-800 overflow-hidden">
          {/* Theme Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 shrink-0">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-navy-900 dark:text-white">{t('theme')}</h3>
                <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">{t('theme_description')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                'relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0',
                theme === 'dark' ? 'bg-gold-500' : 'bg-ivory-400 dark:bg-navy-700'
              )}
              role="switch"
              aria-checked={theme === 'dark'}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300',
                  theme === 'dark' && 'translate-x-6'
                )}
              />
            </button>
          </div>

          {/* Language Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 shrink-0">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-navy-900 dark:text-white">{t('language')}</h3>
                <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">{t('language_description')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-ivory-100 dark:bg-navy-800 self-start sm:self-auto border border-ivory-300 dark:border-navy-700">
              {['ar', 'en'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => i18n.changeLanguage(lang)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200',
                    (i18n.resolvedLanguage || i18n.language) === lang
                      ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-xs'
                      : 'text-navy-500 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white'
                  )}
                >
                  {lang === 'ar' ? 'العربية' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-ivory-100 dark:bg-navy-800 text-navy-500 dark:text-navy-400 shrink-0">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-navy-900 dark:text-white">{t('system_info')}</h3>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-navy-400 w-28">{t('app_version')}</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">v1.2.0 (Hail Culture Build)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-navy-400 w-28">التقنيات</span>
                  <span className="font-mono text-navy-600 dark:text-navy-300">React 18 + Vite + Supabase + TailwindCSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
