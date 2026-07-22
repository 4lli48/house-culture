import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Shield, Save, Loader2, User, Sliders, Moon, Sun, Globe, Info, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { getErrorMessage, cn, getUserRole, getUserRoleLabel } from '../lib/utils';
import { toast } from 'react-toastify';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'settings' ? 'settings' : tabParam === 'security' ? 'security' : 'profile';

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  const [fullName, setFullName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() || null })
        .eq('id', user.id);
      if (error) throw error;
      toast.success(t('profile_updated'));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('يرجى إدخال كلمة المرور الجديدة');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('تم تغيير كلمة المرور بنجاح');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setChangingPassword(false);
    }
  };

  const setTab = (tabName: 'profile' | 'security' | 'settings') => {
    if (tabName === 'profile') setSearchParams({});
    else setSearchParams({ tab: tabName });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Banner */}
      <div className="surface-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 text-xs font-extrabold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            حساب المستخدم والتفضيلات
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            {activeTab === 'settings' ? t('settings') : activeTab === 'security' ? 'الأمان وكلمة المرور' : t('profile')}
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {activeTab === 'settings'
              ? 'تفضيلات المظهر واللغة ومعلومات النظام'
              : activeTab === 'security'
              ? 'تحديث كلمة المرور وحماية الحساب'
              : 'إدارة البيانات الشخصية والمعلومات العامة'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-800 self-start sm:self-auto border border-slate-200/80 dark:border-navy-700">
          <button
            type="button"
            onClick={() => setTab('profile')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 select-none',
              activeTab === 'profile'
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
            )}
          >
            <User className="w-4 h-4 text-gold-500" />
            <span>{t('profile')}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('security')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 select-none',
              activeTab === 'security'
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
            )}
          >
            <KeyRound className="w-4 h-4 text-gold-500" />
            <span>كلمة المرور</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('settings')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 select-none',
              activeTab === 'settings'
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
            )}
          >
            <Sliders className="w-4 h-4 text-gold-500" />
            <span>{t('settings')}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Profile Info */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="surface-card p-6 sm:p-8 space-y-8 rounded-3xl shadow-card">
            {/* User Emblem */}
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
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border',
                    getUserRole(user?.email) === 'admin'
                      ? 'bg-gold-500/10 text-gold-700 dark:text-gold-400 border-gold-500/20'
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-700'
                  )}>
                    <Shield className="w-3.5 h-3.5 text-gold-500" />
                    {getUserRoleLabel(user?.email)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200 text-xs font-bold border border-slate-200 dark:border-navy-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[200px]">{user?.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-5 pt-6 border-t border-slate-100 dark:border-navy-800">
              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t('full_name')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-navy-800 bg-slate-100 dark:bg-navy-950 text-slate-400 text-xs font-bold cursor-not-allowed opacity-70"
                />
                <p className="text-[11px] text-slate-400 font-semibold mt-1">البريد الإلكتروني معتمد ومربوط بالنظام الموحد</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-gold px-6 py-3 text-xs gap-2 rounded-2xl"
                >
                  {savingProfile ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('saving')}</span></>
                  ) : (
                    <><Save className="w-4 h-4" /><span>{t('save')}</span></>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="surface-card p-6 rounded-3xl">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">{t('joined')}</p>
              <p className="text-sm font-extrabold text-navy-900 dark:text-white">
                {user?.created_at
                  ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(user.created_at))
                  : '—'}
              </p>
            </div>
            <div className="surface-card p-6 rounded-3xl">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">الجهة المعنية</p>
              <p className="text-sm font-extrabold text-navy-900 dark:text-white">بيت الثقافة بحائل</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Password Change */}
      {activeTab === 'security' && (
        <div className="surface-card p-6 sm:p-8 space-y-6 rounded-3xl shadow-card">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-navy-800">
            <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-navy-900 dark:text-white">تحديث كلمة المرور</h2>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                تأمين حسابك عبر اختيار كلمة مرور قوية وتحديثها بانتظام
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
            <div>
              <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                كلمة المرور الجديدة *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 rounded-2xl border border-slate-200/80 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                تأكيد كلمة المرور الجديدة *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 rounded-2xl border border-slate-200/80 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="btn-gold px-6 py-3 text-xs gap-2 rounded-2xl"
              >
                {changingPassword ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>جار التحديث...</span></>
                ) : (
                  <><Save className="w-4 h-4" /><span>تحديث كلمة المرور</span></>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: System Settings */}
      {activeTab === 'settings' && (
        <div className="surface-card divide-y divide-slate-100 dark:divide-navy-800 rounded-3xl overflow-hidden shadow-card">
          {/* Theme Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 shrink-0">
                {theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-navy-900 dark:text-white">{t('theme')}</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('theme_description')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none shrink-0 cursor-pointer',
                theme === 'dark' ? 'bg-gold-500' : 'bg-slate-300 dark:bg-navy-700'
              )}
              role="switch"
              aria-checked={theme === 'dark'}
            >
              <span
                className={cn(
                  'absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300',
                  theme === 'dark' && 'translate-x-7'
                )}
              />
            </button>
          </div>

          {/* Language Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 shrink-0">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-navy-900 dark:text-white">{t('language')}</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('language_description')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-navy-800 self-start sm:self-auto border border-slate-200/80 dark:border-navy-700">
              {['ar', 'en'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => i18n.changeLanguage(lang)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200',
                    (i18n.resolvedLanguage || i18n.language) === lang
                      ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
                  )}
                >
                  {lang === 'ar' ? 'العربية' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="p-6 sm:p-8 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400 shrink-0">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-navy-900 dark:text-white">{t('system_info')}</h3>
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="font-extrabold text-slate-400 w-32">{t('app_version')}</span>
                  <span className="font-mono font-bold text-gold-600 dark:text-gold-400">v1.2.0 (Hail Culture Release)</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="font-extrabold text-slate-400 w-32">التقنيات المستخدمة</span>
                  <span className="font-mono text-navy-700 dark:text-slate-300">React 18 + TypeScript + Vite + Supabase + TailwindCSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
