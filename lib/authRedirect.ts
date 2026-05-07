import { Platform } from 'react-native';

const nativeRedirectUrl = 'fireapp://auth/callback';

export function getAuthRedirectUrl() {
  if (Platform.OS !== 'web') {
    return nativeRedirectUrl;
  }

  if (typeof window === 'undefined') {
    return nativeRedirectUrl;
  }

  return `${window.location.origin}/auth.html`;
}
