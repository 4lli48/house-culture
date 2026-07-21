import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../lib/utils';

export interface ActivityLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  profile?: {
    email: string;
    full_name: string | null;
  } | null;
}

export function useActivityLog(limit = 50) {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          user_id,
          action,
          entity_type,
          entity_id,
          details,
          created_at,
          profile:profiles(email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setLogs((data as unknown as ActivityLogEntry[]) || []);
    } catch (err) {
      setError(new Error(getErrorMessage(err)));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}

/**
 * Helper to log an activity action to the activity_logs table.
 */
export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  details,
}: {
  userId: string | null;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  try {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      details: details ?? null,
    });
  } catch {
    // Fire-and-forget — don't let logging failures affect UX
  }
}
