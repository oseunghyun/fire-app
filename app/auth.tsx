import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthCard } from '@/components/auth-card';
import { FireMascot, ScreenShell, SectionCard } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { useAuth } from '@/hooks/use-auth';

export default function AuthScreen() {
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session]);
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard style={styles.hero}>
          <Text style={styles.brand}>FIRE<Text style={styles.brandDot}>.</Text></Text>
          <Text style={styles.title}>우리 가족의 파이어 여정을 저장하고 이어서 확인하세요.</Text>
          <Text style={styles.body}>로그인 후에도 실제 자산, 소득, 지출 원문은 기기에만 보관합니다.</Text>
          <View style={styles.mascotRow}>
            <FireMascot size={74} mood="saving" />
            <FireMascot size={62} mood="goal" />
            <FireMascot size={56} mood="winner" />
          </View>
        </SectionCard>

        <AuthCard />
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 48,
    paddingTop: 54,
  },
  hero: {
    overflow: 'hidden',
  },
  brand: {
    color: palette.ink,
    ...typography.logo,
    fontSize: 64,
    lineHeight: 68,
  },
  brandDot: {
    color: palette.coral,
  },
  title: {
    color: palette.ink,
    ...typography.displayMd,
    marginTop: 14,
  },
  body: {
    color: palette.textSecondary,
    ...typography.body,
    marginTop: 12,
  },
  mascotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
  },
});
