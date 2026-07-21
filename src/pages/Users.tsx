import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Shield, Loader2, Activity, Users as UsersIcon, RefreshCw, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../lib/utils';
import { useActivityLog } from '../hooks/useActivityLog';
import { cn } from '../lib/utils';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'employee';
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  device_created: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
  device_updated: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
  device_deleted: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/50',
  status_changed: 'bg-gold-50 text-gold-700 dark:bg-gold-950/40 dark:text-gold-400 border-gold-200 dark:border-gold-800/50',
};

const DEFAULT_ACTION_COLOR = 'bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-slate-300 border-slate-200 dark:border-navy-700';

export default function Users() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState<Error | null>(null);
  const [tab, setTab] = useState<'users' | 'activity'>('users');
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const { logs, loading: logsLoading, error: logsError, refetch: refetchLogs } = useActivityLog(200);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setProfilesLoading(true);
        setProfilesError(null);
        const { data, error } = await supabase
          .from('profiles')
          .select('id,email,full_name,role,created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProfiles(data || []);
      } catch (err) {
        setProfilesError(new Error(getErrorMessage(err)));
      } finally {
        setProfilesLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchAction = !actionFilter || log.action === actionFilter;
      const matchUser = !userFilter || log.user_id === userFilter;
      return matchAction && matchUser;
    });
  }, [logs, actionFilter, userFilter]);

  const uniqueActions = useMemo(() => Array.from(new Set(logs.map((l) => l.action))), [logs]);

  const tabs = [
    { key: 'users', label: t('users'), icon: UsersIcon, count: profiles.length },
    { key: 'activity', label: t('activity_log'), icon: Activity, count: logs.length },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            {t('users')}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {t('users_description')}
          </p>
        </div>
        {tab === 'activity' && (
          <button
            type="button"
            onClick={refetchLogs}
            className="btn-outline gap-2 self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">تحديث</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-800 w-fit">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200',
              tab === key
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-slate-200'
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            <span className={cn(
              'text-[10px] font-extrabold px-1.5 py-0.5 rounded-full',
              tab === key
                ? 'bg-gold-500/15 text-gold-600 dark:text-gold-400'
                : 'bg-slate-200 dark:bg-navy-700 text-slate-500 dark:text-slate-400'
            )}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab: Users */}
      {tab === 'users' && (
        <div className="glass-card rounded-2xl overflow-hidden">
          {profilesLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <Loader2 className="w-7 h-7 animate-spin text-gold-500" />
              <span className="text-sm font-medium text-slate-400">{t('loading')}</span>
            </div>
          ) : profilesError ? (
            <div className="p-8 text-center text-rose-600 dark:text-rose-400 font-medium">{profilesError.message}</div>
          ) : profiles.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">{t('no_data')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('email')}</th>
                    <th>{t('role')}</th>
                    <th>{t('created_at')}</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-white font-bold text-sm shadow-gold-sm shrink-0">
                            {profile.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-navy-900 dark:text-white">
                            {profile.full_name || profile.email.split('@')[0]}
                          </span>
                        </div>
                      </td>
                      <td className="text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {profile.email}
                        </span>
                      </td>
                      <td>
                        <span className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border',
                          profile.role === 'admin'
                            ? 'bg-gold-50 text-gold-800 border-gold-200 dark:bg-gold-950/40 dark:text-gold-300 dark:border-gold-800/50'
                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-navy-800 dark:text-slate-300 dark:border-navy-700'
                        )}>
                          <Shield className="h-3 w-3" />
                          {t(profile.role)}
                        </span>
                      </td>
                      <td className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(profile.created_at))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Activity Log */}
      {tab === 'activity' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="glass-card p-4 rounded-2xl flex flex-wrap gap-3 items-center">
            <Filter className="w-4 h-4 text-gold-500 shrink-0" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white/80 dark:bg-navy-800 dark:border-navy-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-sm font-medium"
            >
              <option value="">{t('all_actions')}</option>
              {uniqueActions.map((a) => (
                <option key={a} value={a}>{t(a)}</option>
              ))}
            </select>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white/80 dark:bg-navy-800 dark:border-navy-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-sm font-medium"
            >
              <option value="">{t('all_users')}</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>{p.full_name || p.email.split('@')[0]}</option>
              ))}
            </select>
            {(actionFilter || userFilter) && (
              <button
                type="button"
                onClick={() => { setActionFilter(''); setUserFilter(''); }}
                className="text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors"
              >
                {t('clear_filters')}
              </button>
            )}
            <span className="ml-auto text-xs font-medium text-slate-400">{filteredLogs.length} سجل</span>
          </div>

          {/* Log entries */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {logsLoading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <Loader2 className="w-7 h-7 animate-spin text-gold-500" />
                <span className="text-sm font-medium text-slate-400">{t('loading')}</span>
              </div>
            ) : logsError ? (
              <div className="p-8 text-center text-rose-600 dark:text-rose-400 font-medium">{logsError.message}</div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <Activity className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-400">{t('no_data')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('performed_by')}</th>
                      <th>{t('action')}</th>
                      <th>الجهاز</th>
                      <th>{t('date_time')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => {
                      const prof = log.profile as { email: string; full_name: string | null } | null;
                      const userName = prof?.full_name || prof?.email?.split('@')[0] || 'مجهول';
                      const initial = (prof?.email?.charAt(0) || '?').toUpperCase();
                      const deviceName = (log.details as Record<string, unknown>)?.name as string | undefined;
                      const invCode = (log.details as Record<string, unknown>)?.inventory_code as string | undefined;

                      return (
                        <tr key={log.id}>
                          <td>
                            <div className="flex items-center gap-2.5">
                              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-white text-[10px] font-bold shrink-0">
                                {initial}
                              </div>
                              <span className="font-semibold text-navy-900 dark:text-white text-sm">{userName}</span>
                            </div>
                          </td>
                          <td>
                            <span className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border',
                              ACTION_COLORS[log.action] || DEFAULT_ACTION_COLOR
                            )}>
                              {t(log.action)}
                            </span>
                          </td>
                          <td>
                            {deviceName ? (
                              <div>
                                <p className="font-semibold text-navy-900 dark:text-white text-sm truncate max-w-[180px]">{deviceName}</p>
                                {invCode && (
                                  <span className="font-mono text-[10px] text-slate-400">{invCode}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="text-slate-500 dark:text-slate-400 text-xs font-mono whitespace-nowrap">
                            {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(log.created_at))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
