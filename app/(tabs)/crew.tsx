import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CrewRankingCard, FireProgressBar, HandDrawnCard, Header, HighlightNote, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { formatPercent } from '@/lib/fireCalculator';
import { crewRanking, familyContribution } from '@/lib/sampleData';

const myCrewRank = crewRanking.find((member) => member.name === '우리집') ?? crewRanking[2];

export default function CrewScreen() {
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="파이어 챌린저" title="길드 랭킹 모드" />

        <HandDrawnCard accent={palette.softCream} style={styles.heroCard}>
          <Text style={styles.heroTitle}>이번 달 저축률 랭킹 👑</Text>
          <Text style={styles.heroBody}>1위보다 26%p 낮아요. 저축률 20만원만 더 하면 4위 진입 가능!</Text>
        </HandDrawnCard>

        <HandDrawnCard style={styles.rankingCard}>
          <CrewRankingCard
            myRank={myCrewRank.rank}
            rows={crewRanking.map((member) => ({
              rank: member.rank,
              name: member.rank === myCrewRank.rank ? `${member.name} (나)` : member.name,
              value: formatPercent(member.savingsRate),
              badge: member.rank <= 3 ? `${member.rank}` : undefined,
            }))}
          />
        </HandDrawnCard>

        <HighlightNote text="1위보다 26%p 낮아요! 저축률을 20만원만 더 올리면 4위 진입 가능 💪" emoji="🏁" style={styles.note} />

        <HandDrawnCard accent="#FFF8F0" style={styles.shareCard}>
          <Text style={styles.sectionTitle}>배우자 포함 vs 제외</Text>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>포함 시</Text>
            <Text style={styles.compareValue}>8년 4개월</Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareLabel}>제외 시</Text>
            <Text style={[styles.compareValue, styles.compareMuted]}>14년 7개월</Text>
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
    color: '#8A8377',
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
