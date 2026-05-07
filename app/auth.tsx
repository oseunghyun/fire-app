import { ScrollView, StyleSheet, Text } from 'react-native';

import { AuthCard } from '@/components/auth-card';
import { MascotCluster, ScreenShell, SectionCard } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';

export default function AuthScreen() {
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard style={styles.hero}>
          <Text style={styles.brand}>FIRE<Text style={styles.brandDot}>.</Text></Text>
          <Text style={styles.title}>우리 가족의 파이어 여정을 저장하고 이어서 확인하세요.</Text>
          <Text style={styles.body}>로그인 후에도 실제 자산, 소득, 지출 원문은 기기에만 보관합니다.</Text>
          <MascotCluster />
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
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 68,
  },
  brandDot: {
    color: palette.coral,
  },
  title: {
    color: palette.ink,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 36,
    marginTop: 14,
  },
  body: {
    color: '#4D4B46',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 25,
    marginTop: 12,
  },
});
