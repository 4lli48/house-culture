import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Building2, Lock, Mail, Loader2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
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
      
      {/* Right Cultural Hero (RTL dominant) */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-gradient relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Architectural Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5943A' fill-opacity='1'%3E%3Cpath d='M40 0l40 40-40 40L0 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Header Emblem */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-gradient shadow-gold text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight leading-tight">بيت الثقافة بحائل</h2>
            <p className="text-xs text-gold-400 font-bold tracking-wider">الجمهورية والوزارة — إدارة المخزون</p>
          </div>
        </div>

        {/* Central Vision Statement */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            بوابة الإدارة الرقمية الموحدة
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight text-white">
            منصة تتبع وحوكمة الأجهزة والمحتوى الثقافي
          </h1>

          <div className="w-20 h-1 rounded-full bg-gold-gradient" />

          <p className="text-sm text-navy-200 leading-relaxed font-medium">
            نظام متكامل وموثوق يضمن أعلى درجات الدقة والشفافية في إدارة الأصول التقنية والمخزنية لمركز بيت الثقافة بحائل.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs font-semibold text-navy-400 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة لبيت الثقافة</span>
          <span className="font-mono">v1.2.0</span>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 bg-white/70 dark:bg-navy-900/60 backdrop-blur-xl">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          {/* Header Mobile */}
          <div className="text-center space-y-3">
            <div className="inline-flex lg:hidden items-center justify-center w-14 h-14 rounded-2xl bg-gold-gradient text-white shadow-gold mb-2">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
              تسجيل الدخول
            </h2>
            <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">
              أدخل بيانات حسابك المعتمد للوصول إلى لوحة التحكم
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-extrabold text-navy-700 dark:text-navy-300 uppercase tracking-wider mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5">
                  <Mail className="w-5 h-5 text-navy-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  required
                  placeholder="name@culturehail.gov.sa"
                  className="block w-full rounded-xl border border-ivory-300 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white placeholder-navy-400 ltr:pl-11 rtl:pr-11 py-3.5 text-sm shadow-xs focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-200 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-navy-700 dark:text-navy-300 uppercase tracking-wider mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:left-0 rtl:right-0 ltr:pl-3.5 rtl:pr-3.5">
                  <Lock className="w-5 h-5 text-navy-400" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-ivory-300 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-900 dark:text-white placeholder-navy-400 ltr:pl-11 rtl:pr-11 py-3.5 text-sm shadow-xs focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-200 font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 text-base gap-2 group"
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
