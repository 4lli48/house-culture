import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Shield, Loader2, Activity, Users as UsersIcon, RefreshCw, Filter, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getErrorMessage, cn } from '../lib/utils';
import { useActivityLog } from '../hooks/useActivityLog';
import AddLogModal from '../components/AddLogModal';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'employee';
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  device_created: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  device_updated: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
  device_deleted: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
  status_changed: 'bg-gold-50 text-gold-700 dark:bg-gold-950/40 dark:text-gold-300 border-gold-200 dark:border-gold-800/50',
  maintenance_note: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  inspection: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/50',
};

const DEFAULT_ACTION_COLOR = 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300 border-slate-200 dark:border-navy-700';

export default function Users() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState<Error | null>(null);
  const [tab, setTab] = useState<'users' | 'activity'>('users');
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [showAddLog, setShowAddLog] = useState(false);

  const { logs, loading: logsLoading, error: logsError, refetch: refetchLogs } = useActivityLog(250);

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
      {/* Header */}
      <div className="surface-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            {t('users')}
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
            متابعة مستخدمي النظام ورصد التاريخ الكامل لكافة العمليات والسجلات
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {tab === 'activity' && (
            <>
              <button
                type="button"
                onClick={refetchLogs}
                className="p-2.5 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:border-gold-500/50 transition-all shadow-xs"
                title="تحديث السجل"
              >
                <RefreshCw className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowAddLog(true)}
                className="btn-gold px-5 py-3 text-xs gap-2 rounded-2xl"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سجل جديد</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-800 w-fit border border-slate-200/80 dark:border-navy-700">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 select-none',
              tab === key
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
            )}
          >
            <Icon className="w-4 h-4 text-gold-500" />
            <span>{label}</span>
            <span className={cn(
              'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full',
              tab === key
                ? 'bg-gold-500/15 text-gold-700 dark:text-gold-400'
                : 'bg-slate-200 dark:bg-navy-800 text-slate-500 dark:text-slate-400'
            )}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Users List */}
      {tab === 'users' && (
        <div className="surface-card rounded-3xl overflow-hidden shadow-card">
          {profilesLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
              <span className="text-xs font-bold text-slate-400">{t('loading')}</span>
            </div>
          ) : profilesError ? (
            <div className="p-8 text-center text-rose-600 dark:text-rose-400 font-bold">{profilesError.message}</div>
          ) : profiles.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-extrabold">{t('no_data')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead className="bg-ivory-100 dark:bg-navy-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-extrabold uppercase text-slate-600 dark:text-slate-300">{t('name')}</th>
                    <th className="px-6 py-4 text-xs font-extrabold uppercase text-slate-600 dark:text-slate-300">{t('email')}</th>
                    <th className="px-6 py-4 text-xs font-extrabold uppercase text-slate-600 dark:text-slate-300">{t('role')}</th>
                    <th className="px-6 py-4 text-xs font-extrabold uppercase text-slate-600 dark:text-slate-300">{t('created_at')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-slate-50/80 dark:hover:bg-navy-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gold-gradient text-white font-extrabold text-sm shadow-gold-sm shrink-0">
                            {profile.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-extrabold text-navy-900 dark:text-white text-sm">
                            {profile.full_name || profile.email.split('@')[0]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                          {profile.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold border',
                          profile.role === 'admin'
                            ? 'bg-gold-50 text-gold-800 border-gold-300 dark:bg-gold-950/50 dark:text-gold-300 dark:border-gold-800'
                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-navy-800 dark:text-slate-300 dark:border-navy-700'
                        )}>
                          <Shield className="h-3.5 w-3.5" />
                          {t(profile.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs font-semibold">
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

      {/* Tab 2: Activity Logs & Manual Logs */}
      {tab === 'activity' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="surface-card p-4 rounded-3xl flex flex-wrap gap-3 items-center">
            <Filter className="w-4 h-4 text-gold-500 shrink-0" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-xs font-bold"
            >
              <option value="">{t('all_actions')}</option>
              {uniqueActions.map((a) => (
                <option key={a} value={a}>{t(a) === a ? a : t(a)}</option>
              ))}
            </select>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white dark:bg-navy-800 dark:border-navy-700 text-navy-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-xs font-bold"
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
                className="text-xs font-extrabold text-slate-500 hover:text-rose-500 transition-colors"
              >
                {t('clear_filters')}
              </button>
            )}

            <span className="ltr:ml-auto rtl:mr-auto text-xs font-bold text-slate-400">
              {filteredLogs.length} سجل محصى
            </span>
          </div>

          {/* Logs List Table */}
          <div className="surface-card rounded-3xl overflow-hidden shadow-card">
            {logsLoading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
                <span className="text-xs font-bold text-slate-400">{t('loading')}</span>
              </div>
            ) : logsError ? (
              <div className="p-8 text-center text-rose-600 dark:text-rose-400 font-bold">{logsError.message}</div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Activity className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs font-bold text-slate-400">{t('no_data')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[600px] relative">
                <table className="data-table w-full">
                  <thead className="sticky top-0 z-10 bg-ivory-100 dark:bg-navy-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-extrabold uppercase text-slate-600 dark:text-slate-300">{t('performed_by')}</th>
                      <th className="px-6 py-4 text-xs font-extrabold uppercase text-slate-600 dark:text-slate-300">{t('action')}</th>
                      <th className="px-6 py-4 text-xs font-extrabold uppercase text-slate-600 dark:text-slate-300">التفاصيل/الجهاز</th>
                      <th className="px-6 py-4 text-xs font-extrabold uppercase text-slate-600 dark:text-slate-300">{t('date_time')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                    {filteredLogs.map((log) => {
                      const prof = log.profile as { email: string; full_name: string | null } | null;
                      const userName = prof?.full_name || prof?.email?.split('@')[0] || 'مستخدم النظام';
                      const initial = (prof?.email?.charAt(0) || 'U').toUpperCase();
                      const detailsObj = (log.details as Record<string, unknown>) || {};
                      const deviceName = detailsObj.name as string | undefined;
                      const invCode = detailsObj.inventory_code as string | undefined;
                      const noteText = detailsObj.note as string | undefined;
                      const oldStatus = detailsObj.old_status as string | undefined;
                      const newStatus = detailsObj.new_status as string | undefined;

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-navy-800/40 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gold-gradient text-white text-xs font-extrabold shrink-0">
                                {initial}
                              </div>
                              <span className="font-extrabold text-navy-900 dark:text-white text-xs">{userName}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              'inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border',
                              ACTION_COLORS[log.action] || DEFAULT_ACTION_COLOR
                            )}>
                              {t(log.action) === log.action ? log.action : t(log.action)}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-0.5">
                              {deviceName && (
                                <p className="font-extrabold text-navy-900 dark:text-white text-xs truncate max-w-xs">
                                  {deviceName}
                                </p>
                              )}
                              {invCode && (
                                <span className="font-mono text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 inline-block">
                                  {invCode}
                                </span>
                              )}
                              {oldStatus && newStatus && (
                                <p className="text-[11px] font-semibold text-slate-500">
                                  تغيير الحالة: <span className="line-through text-slate-400">{oldStatus}</span> &rarr; <span className="text-gold-600 font-extrabold">{newStatus}</span>
                                </p>
                              )}
                              {noteText && (
                                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-1">
                                  {noteText}
                                </p>
                              )}
                              {!deviceName && !invCode && !noteText && !oldStatus && (
                                <span className="text-slate-400 text-xs">—</span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-mono font-semibold whitespace-nowrap">
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

      {/* Add Log Modal */}
      {showAddLog && (
        <AddLogModal
          onClose={() => setShowAddLog(false)}
          onSuccess={() => {
            setShowAddLog(false);
            refetchLogs();
          }}
        />
      )}
    </div>
  );
}
