import * as Linking from 'expo-linking';
import { useEffect } from 'react';

import { supabase } from '@/lib/supabase';

export function useAuthCallbacks() {
  useEffect(() => {
    if (!supabase) {
      return;
    }

    async function handleUrl(url: string) {
      const parsedUrl = new URL(url);
      const code = parsedUrl.searchParams.get('code');
      const error = parsedUrl.searchParams.get('error_description') ?? parsedUrl.searchParams.get('error');

      if (error) {
        console.warn(`Auth redirect failed: ${error}`);
        return;
      }

      if (code) {
        await supabase?.auth.exchangeCodeForSession(code);
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
