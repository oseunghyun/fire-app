import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header, MascotCluster, MountainScene, ProgressBar, ScreenShell, SectionCard, SmallStat } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { formatFireDistance, formatPercent } from '@/lib/fireCalculator';
import { fireResult } from '@/lib/sampleData';

export default function HomeScreen() {
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="홈 대시보드" title={formatFireDistance(fireResult.monthsToFire)} />

        <SectionCard style={styles.countdownCard}>
          <Text style={styles.cardLabel}>파이어까지 남은 시간</Text>
          <ProgressBar value={fireResult.achievementRate} />
          <View style={styles.metricRow}>
            <Text style={styles.bigMetric}>{formatPercent(fireResult.achievementRate)}</Text>
            <Text style={styles.metricLabel}>목표 달성률</Text>
          </View>
          <View style={styles.rewardNote}>
            <Text style={styles.rewardText}>이번 달 저축으로 {fireResult.savedMonthsThisMonth}개월 단축됐어요.</Text>
          </View>
        </SectionCard>

        <SectionCard accent="#F4FBEF" style={styles.sceneCard}>
          <MountainScene />
        </SectionCard>

        <View style={styles.statsRow}>
          <SmallStat icon="savings" label="이번 달 저축률" value={formatPercent(fireResult.savingsRate)} />
          <SmallStat icon="groups" label="크루 내 순위" value="3위" />
        </View>

        <SectionCard style={styles.onboardingCard}>
          <Text style={styles.brand}>FIRE<Text style={styles.brandDot}>.</Text></Text>
          <Text style={styles.onboardingTitle}>우리 가족, 언제 파이어 가능할까?</Text>
          <Text style={styles.onboardingBody}>
            가구원별 수입과 지출을 모아 은퇴 가능 시점을 계산하고, 매달 자산 변화로 여정을 다시 확인합니다.
          </Text>
          <MascotCluster />
        </SectionCard>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
  },
  countdownCard: {
    marginTop: 12,
  },
  cardLabel: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 18,
  },
  metricRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  bigMetric: {
    color: palette.ink,
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 62,
  },
  metricLabel: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '900',
    paddingBottom: 10,
  },
  rewardNote: {
    backgroundColor: '#F5F2EA',
    borderRadius: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rewardText: {
    color: palette.coral,
    fontSize: 14,
    fontWeight: '900',
  },
  sceneCard: {
    padding: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 14,
  },
  onboardingCard: {
    overflow: 'hidden',
  },
  brand: {
    color: palette.ink,
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 60,
  },
  brandDot: {
    color: palette.coral,
  },
  onboardingTitle: {
    color: palette.ink,
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 35,
    marginTop: 12,
  },
  onboardingBody: {
    color: '#4D4B46',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 25,
    marginTop: 12,
  },
});
