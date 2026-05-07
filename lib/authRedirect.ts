import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export function getAuthRedirectUrl() {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      // Matches the URLs in Supabase config: http://localhost:8081/auth and https://.../auth
      return `${window.location.origin}/auth`;
    }
    return '';
  }

  // Uses the scheme defined in app.json for standalone builds,
  // or exp:// for Expo Go automatically.
  return Linking.createURL('/auth/callback');
}
