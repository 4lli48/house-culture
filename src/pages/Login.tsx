import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { MonitorSmartphone, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../lib/utils';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormValues>();

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600">
              <MonitorSmartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              بيت الثقافة
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tech Inventory Management
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('email')}
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    required
                    className="block w-full rounded-lg border-gray-300 bg-white ltr:pl-10 rtl:pr-10 py-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('password')}
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    required
                    className="block w-full rounded-lg border-gray-300 bg-white ltr:pl-10 rtl:pr-10 py-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex justify-center w-full px-4 py-2.5 text-sm font-semibold text-white transition-colors border border-transparent rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? '...' : t('login')}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block bg-primary-900">
        <div className="absolute inset-0 object-cover w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-xl text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Welcome to Hail Culture House</h1>
            <p className="text-lg text-primary-200">Manage all your technological assets, track maintenance, and ensure everything runs smoothly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
