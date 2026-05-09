import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';

import AbiMimiFont from '@/assets/fonts/AbiMimi-Bold.ttf';
import JoyfulStoryFont from '@/assets/fonts/JoyfulStory-Bold.otf';
import { navigationFonts } from '@/constants/typography';
import { useAuthCallbacks } from '@/hooks/use-auth-callbacks';
import PretendardBold from '@/assets/fonts/Pretendard-Bold.otf';
import PretendardExtraBold from '@/assets/fonts/Pretendard-ExtraBold.otf';
import PretendardMedium from '@/assets/fonts/Pretendard-Medium.otf';
import PretendardSemiBold from '@/assets/fonts/Pretendard-SemiBold.otf';
import { useHouseholdStore } from '@/store/householdStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAuthCallbacks();
  const router = useRouter();
  const pathname = usePathname();
  const lastRedirectRef = useRef<string | null>(null);
  const hasHydrated = useHouseholdStore((state) => state.hasHydrated);
  const hasCompletedOnboarding = useHouseholdStore((state) => state.hasCompletedOnboarding);
  const hydrate = useHouseholdStore((state) => state.hydrate);
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard-Medium': PretendardMedium,
    'Pretendard-SemiBold': PretendardSemiBold,
    'Pretendard-Bold': PretendardBold,
    'Pretendard-ExtraBold': PretendardExtraBold,
    JoyfulStory: JoyfulStoryFont,
    AbiMimi: AbiMimiFont,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  useEffect(() => {
    if (!hasHydrated) {
      void hydrate();
    }
  }, [hasHydrated, hydrate]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const shouldGoToOnboarding = !hasCompletedOnboarding && pathname !== '/onboarding';
    const shouldGoToHome = hasCompletedOnboarding && pathname === '/onboarding';
    const nextRoute = shouldGoToOnboarding ? '/onboarding' : shouldGoToHome ? '/' : null;

    if (!nextRoute) {
      lastRedirectRef.current = null;
      return;
    }

    if (lastRedirectRef.current !== nextRoute) {
      lastRedirectRef.current = nextRoute;
      router.replace(nextRoute);
    }
  }, [hasCompletedOnboarding, hasHydrated, pathname, router]);

  if ((!fontsLoaded && !fontError) || !hasHydrated) {
    return null;
  }

  const navigationTheme = {
    ...DefaultTheme,
    fonts: navigationFonts,
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
