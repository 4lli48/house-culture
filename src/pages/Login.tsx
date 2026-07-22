import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Building2, Lock, Mail, Loader2, ArrowLeft, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../lib/utils';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormValues>();

  const ArrowIcon = i18n.language === 'ar' ? ArrowLeft : ArrowRight;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-ivory-200 dark:bg-navy-950 text-navy-900 dark:text-ivory-100 transition-colors duration-300 font-arabic">
      
      {/* Right Cultural Hero Side (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-gradient relative overflow-hidden flex-col justify-between p-14 text-white">
        {/* Subtle geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5943A' fill-opacity='1'%3E%3Cpath d='M40 0l40 40-40 40L0 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Ambient lighting glow */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-navy-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-gradient shadow-gold text-white">
            <Building2 className="w-6.5 h-6.5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight leading-tight">بيت الثقافة بحائل</h2>
            <p className="text-xs text-gold-400 font-bold tracking-wider mt-0.5">منصة حوكمة وإدارة المخزون الرقمي</p>
          </div>
        </div>

        {/* Central Cultural Vision Card */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-extrabold tracking-wide backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            البوابة الإدارية الموحدة لبيت الثقافة
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight text-white tracking-tight">
            منصة تتبع وحوكمة الأجهزة والمحتوى الثقافي
          </h1>

          <div className="w-20 h-1 rounded-full bg-gold-gradient" />

          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            نظام رقمي موحد يوفر إدارة شاملة، وتتبعاً دقيقاً لجميع الأصول التقنية والمعدات الرقمية لبيت الثقافة بحائل بأعلى معايير الجودة والأمان.
          </p>

          <div className="pt-4 flex items-center gap-6 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>تحديثات وتتبع لحظي</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>حماية وتوثيق مستمر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 bg-white/80 dark:bg-navy-900/80 backdrop-blur-2xl">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          {/* Header Mobile */}
          <div className="text-center space-y-3">
            <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 rounded-3xl bg-gold-gradient text-white shadow-gold mb-2">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
              تسجيل الدخول
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              أدخل بيانات حسابك المعتمد للوصول إلى لوحة حوكمة المخزون
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:left-0 rtl:right-0 ltr:pl-4 rtl:pr-4">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  required
                  placeholder="name@culturehail.gov.sa"
                  className="block w-full rounded-2xl border border-slate-200/90 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white placeholder-slate-400 ltr:pl-12 rtl:pr-12 py-3.5 text-xs font-bold shadow-xs focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-200 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:left-0 rtl:right-0 ltr:pl-4 rtl:pr-4">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-2xl border border-slate-200/90 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white placeholder-slate-400 ltr:pl-12 rtl:pr-12 ltr:pr-12 rtl:pl-12 py-3.5 text-xs font-mono font-bold shadow-xs focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 flex items-center ltr:right-0 rtl:left-0 ltr:pr-4 rtl:pl-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 text-sm gap-2 rounded-2xl group shadow-gold-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{t('login')}</span>
                  <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
