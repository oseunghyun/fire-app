import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthCard } from '@/components/auth-card';
import {
  FireCountdown,
  FireProgressBar,
  FireMascot,
  HandDrawnCard,
  Header,
  HighlightNote,
  PillBadge,
  ScreenShell,
  SmallStat,
} from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { calculateFireResult, formatFireDistance, formatPercent } from '@/lib/fireCalculator';
import { getHouseholdEyebrow } from '@/lib/householdInsights';
import { useHouseholdStore } from '@/store/householdStore';

export default function HomeScreen() {
  const household = useHouseholdStore((state) => state.household);
  const fireResult = calculateFireResult(household);

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow={getHouseholdEyebrow(household)} title="FIRE까지" right={<FireMascot size={60} mood="goal" />} />

        <HandDrawnCard style={styles.heroCard}>
          <FireCountdown
            subLabel="FIRE까지 🔥"
            monthsText={formatFireDistance(fireResult.monthsToFire)}
            speech="잘하고 있어요!"
          />
        </HandDrawnCard>

        <HandDrawnCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionLabel}>달성률</Text>
            <Text style={styles.progressValue}>{formatPercent(fireResult.achievementRate)}</Text>
          </View>
          <FireProgressBar value={fireResult.achievementRate} color={palette.primary} />
          <View style={styles.statGrid}>
            <SmallStat icon="south" label="이번 달 단축" value={`+${fireResult.savedMonthsThisMonth}개월`} accent={palette.softHighlight} />
            <SmallStat icon="military-tech" label="크루 순위" value="상위 18%" accent={palette.softOrange} />
          </View>
        </HandDrawnCard>

        <HighlightNote
          emoji="📝"
          text={`이번 달 저축률 ${formatPercent(fireResult.savingsRate)}, 크루 평균보다 6%p 높아요! 👍`}
          style={styles.note}
        />

        <AuthCard />

        <HandDrawnCard accent={palette.softCream} style={styles.storyCard} tilt={-1.5}>
          <View style={styles.storyTop}>
            <Text style={styles.storyTitle}>우리 가족, 언제 파이어 가능할까?</Text>
            <PillBadge label="월간 자산 트래킹" />
          </View>
          <Text style={styles.storyBody}>
            딱딱한 금융앱보다, 귀여운 불씨랑 같이 달리는 자산 여정. 숫자는 깔끔하게 보고 기분은 게임처럼 가져가요.
          </Text>
          <View style={styles.storyMascots}>
            <FireMascot size={70} mood="winner" />
            <FireMascot size={54} mood="saving" />
            <FireMascot size={62} mood="goal" />
          </View>
        </HandDrawnCard>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 116,
  },
  heroCard: {
    paddingTop: 20,
  },
  progressCard: {
    gap: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionLabel: {
    color: palette.textSecondary,
    ...typography.label,
  },
  progressValue: {
    color: palette.textPrimary,
    ...typography.numberMd,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  note: {
    marginHorizontal: 20,
    marginTop: 14,
  },
  storyCard: {
    marginTop: 18,
  },
  storyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  storyTitle: {
    flex: 1,
    color: palette.textPrimary,
    ...typography.displayMd,
  },
  storyBody: {
    color: palette.textSecondary,
    ...typography.body,
    marginTop: 12,
  },
  storyMascots: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
