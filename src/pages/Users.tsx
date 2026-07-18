import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Shield, UserRound } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../lib/utils';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'employee';
  created_at: string;
}

export default function Users() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('profiles').select('id,email,full_name,role,created_at').order('created_at', {
          ascending: false,
        });

        if (error) throw error;
        setProfiles(data || []);
      } catch (err) {
        setError(new Error(getErrorMessage(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('users')}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('users_description')}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('loading')}</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 dark:text-red-400">{error.message}</div>
        ) : profiles.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('no_data')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-gray-900 dark:bg-gray-700/50 dark:text-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('name')}</th>
                  <th className="px-6 py-4 font-medium">{t('email')}</th>
                  <th className="px-6 py-4 font-medium">{t('role')}</th>
                  <th className="px-6 py-4 font-medium">{t('created_at')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/25">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary-50 p-2 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                          <UserRound className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{profile.full_name || profile.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {profile.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <Shield className="h-3.5 w-3.5" />
                        {t(profile.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(profile.created_at))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
