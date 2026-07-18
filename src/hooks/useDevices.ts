import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../lib/utils';

export interface Device {
  id: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  inventory_code: string;
  serial_number: string | null;
  location: string | null;
  status: 'Working' | 'Broken' | 'Maintenance' | 'Lost';
  purchase_date: string | null;
  warranty_expiry: string | null;
  assigned_employee: string | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (err) {
      setError(new Error(getErrorMessage(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();

    const channel = supabase
      .channel('devices-dashboard-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
        fetchDevices();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDevices]);

  return { devices, loading, error, refetch: fetchDevices };
}
