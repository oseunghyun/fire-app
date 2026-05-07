import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AssetChart, Header, PillButton, ScreenShell, SectionCard } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { formatPercent, formatWon } from '@/lib/fireCalculator';
import { fireResult } from '@/lib/sampleData';

export default function TrackingScreen() {
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="월간 트래킹" title="90초 입력" />

        <SectionCard>
          <Text style={styles.label}>이번 달 총 금융자산</Text>
          <Text style={styles.amount}>{formatWon(fireResult.currentAssets)}</Text>
          <PillButton label="금액 수정하기" />
        </SectionCard>

        <SectionCard>
          <View style={styles.chartHead}>
            <Text style={styles.label}>자산 추세</Text>
            <Text style={styles.greenText}>+4.8%</Text>
          </View>
          <AssetChart />
        </SectionCard>

        <View style={styles.rewardRow}>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>{fireResult.savedMonthsThisMonth}개월{'\n'}단축!</Text>
          </View>
          <Text style={styles.rewardCopy}>
            이번 달 저축률은 {formatPercent(fireResult.savingsRate)}. 가족 크루 평균보다 6%p 높아요.
          </Text>
        </View>

        <SectionCard accent="#FFF8F5">
          <Text style={styles.sectionTitle}>다음 입력 알림</Text>
          <Text style={styles.body}>매달 1일 오전 9시에 자산 업데이트를 요청합니다. 숫자 하나만 넣어도 파이어 거리를 다시 계산해요.</Text>
        </SectionCard>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
  },
  label: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '900',
  },
  amount: {
    color: palette.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 18,
    marginTop: 12,
  },
  chartHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  greenText: {
    color: palette.green,
    fontSize: 16,
    fontWeight: '900',
  },
  rewardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 20,
    marginTop: 22,
  },
  stamp: {
    alignItems: 'center',
    borderColor: palette.coral,
    borderRadius: 48,
    borderWidth: 3,
    height: 96,
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
    width: 96,
  },
  stampText: {
    color: palette.coral,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 24,
    textAlign: 'center',
  },
  rewardCopy: {
    color: '#3E3B36',
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 25,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  body: {
    color: '#4D4B46',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 25,
    marginTop: 10,
  },
});
