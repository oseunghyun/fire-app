import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

import { supabase } from '@/lib/supabase';

export function useAuthCallbacks() {
  useEffect(() => {
    // On web, the Supabase client handles the redirect automatically via detectSessionInUrl: true.
    // Manual handling here is only needed for native deep linking.
    if (!supabase || Platform.OS === 'web') {
      return;
    }

    async function handleUrl(url: string) {
      const parsed = Linking.parse(url);
      const queryParams = parsed.queryParams;

      if (!queryParams) {
        return;
      }

      // Supabase may return errors in the URL
      const error = queryParams.error_description ?? queryParams.error;
      if (error) {
        console.warn(`Auth redirect failed: ${error}`);
        return;
      }

      // Handle PKCE flow (default in newer Supabase clients)
      const code = queryParams.code;
      if (typeof code === 'string') {
        await supabase?.auth.exchangeCodeForSession(code);
        return;
      }

      // Handle implicit flow or fallback if tokens are directly in the URL
      const access_token = queryParams.access_token;
      const refresh_token = queryParams.refresh_token;
      if (typeof access_token === 'string' && typeof refresh_token === 'string') {
        await supabase?.auth.setSession({
          access_token,
          refresh_token,
        });
      }
    }

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => subscription.remove();
  }, []);
}
