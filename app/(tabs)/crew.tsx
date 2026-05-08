import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CrewRankingCard, FireMascot, FireProgressBar, HandDrawnCard, Header, HighlightNote, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { calculateFireResult, formatFireDistance, formatPercent } from '@/lib/fireCalculator';
import { getCrewInsight, getCrewRanking, getFamilyContribution, getPartnerComparison } from '@/lib/householdInsights';
import { useHouseholdStore } from '@/store/householdStore';

export default function CrewScreen() {
  const household = useHouseholdStore((state) => state.household);
  const fireResult = calculateFireResult(household);
  const crewRanking = getCrewRanking(fireResult);
  const crewInsight = getCrewInsight(crewRanking);
  const familyContribution = getFamilyContribution(household);
  const partnerComparison = getPartnerComparison(household);

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="파이어 챌린저" title="길드 랭킹 모드" right={<FireMascot size={60} mood="winner" />} />

        <HandDrawnCard accent={palette.softCream} style={styles.heroCard}>
          <Text style={styles.heroTitle}>이번 달 저축률 랭킹 👑</Text>
          <Text style={styles.heroBody}>
            1위보다 {crewInsight.gapToLeader}%p 낮아요. 저축률을 {Math.max(10, crewInsight.gapToNext)}%p만 더 올리면 바로 윗순위를 노릴 수 있어요.
          </Text>
        </HandDrawnCard>

        <HandDrawnCard style={styles.rankingCard}>
          <CrewRankingCard
            myRank={crewInsight.me.rank}
            rows={crewRanking.map((member) => ({
              rank: member.rank,
              name: member.isMe ? `${member.name} (나)` : member.name,
              value: formatPercent(member.savingsRate),
              badge: member.rank <= 3 ? `${member.rank}` : undefined,
            }))}
          />
        </HandDrawnCard>

        <HighlightNote
          text={`현재 저축률 ${formatPercent(fireResult.savingsRate)}. 이번 달 페이스만 유지해도 FIRE까지 ${formatFireDistance(fireResult.monthsToFire)} 코스예요 💪`}
          emoji="🏁"
          style={styles.note}
        />

        <HandDrawnCard accent={palette.softOrange} style={styles.shareCard}>
          <Text style={styles.sectionTitle}>배우자 포함 vs 제외</Text>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>포함 시</Text>
            <Text style={styles.compareValue}>{formatFireDistance(partnerComparison.withPartnerMonths)}</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>제외 시</Text>
            <Text style={[styles.compareValue, styles.compareMuted]}>{formatFireDistance(partnerComparison.withoutPartnerMonths)}</Text>
          </View>
        </HandDrawnCard>

        <HandDrawnCard style={styles.familyCard}>
          <Text style={styles.sectionTitle}>가족별 자산 기여도</Text>
          {familyContribution.map((member, index) => (
            <View key={member.id} style={styles.progressRow}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{member.name}</Text>
                <Text style={styles.progressPercent}>{formatPercent(member.assetShare)}</Text>
              </View>
              <FireProgressBar value={member.assetShare} color={index === 0 ? palette.chartBlue : palette.orange} />
            </View>
          ))}
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
    gap: 10,
  },
  heroTitle: {
    color: palette.textPrimary,
    ...typography.displayMd,
  },
  heroBody: {
    color: palette.textSecondary,
    ...typography.body,
  },
  rankingCard: {
    paddingTop: 14,
  },
  note: {
    marginHorizontal: 20,
    marginTop: 14,
  },
  shareCard: {
    marginTop: 18,
    gap: 12,
  },
  sectionTitle: {
    color: palette.textPrimary,
    ...typography.titleMd,
  },
  compareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compareLabel: {
    color: palette.textSecondary,
    ...typography.body,
  },
  compareValue: {
    color: palette.chartBlue,
    ...typography.numberLg,
  },
  compareMuted: {
    color: palette.textSecondary,
    fontSize: 24,
  },
  familyCard: {
    marginTop: 18,
  },
  progressRow: {
    marginTop: 14,
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: palette.textPrimary,
    ...typography.bodySm,
  },
  progressPercent: {
    color: palette.textSecondary,
    ...typography.label,
  },
});
