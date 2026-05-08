import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CrewRankingCard, FireMascot, FireProgressBar, HandDrawnCard, Header, HighlightNote, PillButton, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { useAuth } from '@/hooks/use-auth';
import { useFamilyCrew } from '@/hooks/use-family-crew';
import { calculateFireResult, formatFireDistance, formatPercent } from '@/lib/fireCalculator';
import { syncCrewMetrics } from '@/lib/fireData';
import { getCrewInsight, getCrewRanking, getFamilyContribution, getPartnerComparison } from '@/lib/householdInsights';
import { useHouseholdStore } from '@/store/householdStore';

export default function CrewScreen() {
  const household = useHouseholdStore((state) => state.household);
  const { user } = useAuth();
  const { crew, isLoading, error, refresh } = useFamilyCrew(user?.id);
  const fireResult = calculateFireResult(household);
  const [syncMessage, setSyncMessage] = useState('');
  const localRanking = getCrewRanking(fireResult);
  const crewRanking =
    crew?.members && crew.members.length > 0
      ? crew.members.map((member, index) => ({
          rank: index + 1,
          name: member.nickname,
          savingsRate: member.savingsRate,
          isMe: member.userId === user?.id,
        }))
      : localRanking;
  const crewInsight = getCrewInsight(crewRanking);
  const familyContribution = getFamilyContribution(household);
  const partnerComparison = getPartnerComparison(household);

  async function handleSyncCrew() {
    if (!user) {
      setSyncMessage('로그인 후에 크루 기록을 동기화할 수 있어요.');
      return;
    }

    setSyncMessage('');

    try {
      await syncCrewMetrics({
        userId: user.id,
        nickname: user.email?.split('@')[0] ?? '파이어러',
        household,
        fireResult,
      });
      await refresh();
      setSyncMessage('크루 기록을 최신 FIRE 수치로 동기화했어요.');
    } catch (syncError) {
      setSyncMessage(syncError instanceof Error ? syncError.message : '크루 동기화에 실패했어요.');
    }
  }

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="파이어 챌린저" title="길드 랭킹 모드" right={<FireMascot size={60} mood="winner" />} />

        <HandDrawnCard accent={palette.softCream} style={styles.heroCard}>
          <Text style={styles.heroTitle}>이번 달 저축률 랭킹 👑</Text>
          <Text style={styles.heroBody}>
            1위보다 {crewInsight.gapToLeader}%p 낮아요. 저축률을 {Math.max(10, crewInsight.gapToNext)}%p만 더 올리면 바로 윗순위를 노릴 수 있어요.
          </Text>
          <View style={styles.syncRow}>
            <PillButton label={user ? (isLoading ? '불러오는 중...' : '내 기록 동기화') : '로그인 후 동기화'} onPress={handleSyncCrew} />
            <Text style={styles.syncHint}>{crew ? crew.name : '아직 서버 크루가 없으면 로컬 랭킹으로 보여줘요.'}</Text>
          </View>
          {syncMessage || error ? <Text style={styles.syncMessage}>{syncMessage || error}</Text> : null}
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
  syncRow: {
    marginTop: 12,
    gap: 10,
  },
  syncHint: {
    color: palette.textSecondary,
    ...typography.bodySm,
  },
  syncMessage: {
    color: palette.primary,
    ...typography.bodySm,
    marginTop: 10,
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
