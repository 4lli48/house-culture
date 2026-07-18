import { useEffect } from 'react';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { AuthChangeEvent, Session, Subscription, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

let authInitialized = false;
let authSubscription: Subscription | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  initialize: async () => {
    if (authInitialized) return;
    authInitialized = true;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null, loading: false });

      authSubscription?.unsubscribe();
      const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        set({ user: session?.user || null });
      });
      authSubscription = data.subscription;
    } catch (error) {
      set({ loading: false });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

export const useAuth = () => {
  const store = useAuthStore();
  const initialize = useAuthStore((state) => state.initialize);
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return store;
};
