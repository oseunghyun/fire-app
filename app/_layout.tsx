import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import AbiMimiFont from '@/assets/fonts/AbiMimi-Bold.ttf';
import JoyfulStoryFont from '@/assets/fonts/JoyfulStory-Bold.otf';
import { navigationFonts } from '@/constants/typography';
import { useAuthCallbacks } from '@/hooks/use-auth-callbacks';
import PretendardBold from '@/assets/fonts/Pretendard-Bold.otf';
import PretendardExtraBold from '@/assets/fonts/Pretendard-ExtraBold.otf';
import PretendardMedium from '@/assets/fonts/Pretendard-Medium.otf';
import PretendardSemiBold from '@/assets/fonts/Pretendard-SemiBold.otf';

export const unstable_settings = {
  anchor: '(tabs)',
};

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAuthCallbacks();
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

  if (!fontsLoaded && !fontError) {
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
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
