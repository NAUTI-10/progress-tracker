import { useState, useEffect, useCallback } from 'react';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { auth } from '../services/supabase';
import { supabase } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfileName = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setName(null);
      return;
    }

    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      setName(data?.name?.trim() || currentUser.email?.split('@')[0] || 'there');
    } catch (err) {
      console.log('Profile fetch failed:', err);
      console.error('Profile fetch failed:', err);
      setName(currentUser.email?.split('@')[0] || 'there');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data, error: sessionError } = await auth.getSession();
        if (sessionError) throw sessionError;
        if (isMounted) {
          const currentUser = data?.session?.user || null;
          setUser(currentUser);
          void loadProfileName(currentUser);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to check session');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSession();

    const { data: subscription } = auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (isMounted) {
        const currentUser = session?.user || null;
        setUser(currentUser);
        void loadProfileName(currentUser);
      }
    });

    return () => {
      isMounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, [loadProfileName]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await auth.signUp(email, password, name);
      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: name.trim(),
              streak: 0,
              last_streak_date: null,
            },
          ]);

        if (profileError) {
          console.log('Profile upsert failed:', profileError);
          console.error('Profile upsert failed:', profileError);
        }
      }

      return { data, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sign-up failed';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await auth.signIn(email, password);
      if (signInError) throw signInError;
      return { data, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sign-in failed';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await auth.signOut();
      if (signOutError) throw signOutError;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sign-out failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    name,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
};
