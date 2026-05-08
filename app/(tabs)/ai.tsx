import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FireMascot, HandDrawnCard, Header, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { calculateFireResult, formatFireDistance, formatPercent } from '@/lib/fireCalculator';
import { getAiReportSections } from '@/lib/householdInsights';
import { useHouseholdStore } from '@/store/householdStore';

export default function AiScreen() {
  const household = useHouseholdStore((state) => state.household);
  const fireResult = calculateFireResult(household);
  const sections = getAiReportSections(household);
  const [openKey, setOpenKey] = useState<string | null>('summary');

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="AI 월간 리포트" title="AI가 분석 중..." right={<FireMascot size={60} mood="analyzing" />} />

        <HandDrawnCard accent={palette.softOrange} style={styles.loadingCard}>
          <View style={styles.loadingRow}>
            <View style={styles.robotBubble}>
              <FireMascot size={52} mood="analyzing" />
            </View>
            <View style={styles.loadingCopy}>
              <Text style={styles.loadingTitle}>AI가 분석 중...</Text>
              <Text style={styles.loadingBody}>
                이번 달 저축률 {formatPercent(fireResult.savingsRate)}, FIRE까지 {formatFireDistance(fireResult.monthsToFire)} 기준으로 정리했어요.
              </Text>
            </View>
          </View>
        </HandDrawnCard>

        {sections.map((section) => {
          const isOpen = openKey === section.key;

          return (
            <HandDrawnCard key={section.key} style={styles.sectionCard} tilt={isOpen ? -0.5 : 0.5}>
              <Pressable style={styles.sectionHead} onPress={() => setOpenKey(isOpen ? null : section.key)}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <MaterialIcons name={isOpen ? 'expand-less' : 'expand-more'} size={24} color={palette.textPrimary} />
              </Pressable>
              {isOpen ? <Text style={styles.sectionBody}>{section.body}</Text> : null}
            </HandDrawnCard>
          );
        })}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 116,
  },
  loadingCard: {
    marginTop: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  robotBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCopy: {
    flex: 1,
  },
  loadingTitle: {
    color: palette.textPrimary,
    ...typography.displayMd,
  },
  loadingBody: {
    color: palette.textSecondary,
    ...typography.sticker,
    marginTop: 6,
  },
  sectionCard: {
    marginTop: 14,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    flex: 1,
    color: palette.textPrimary,
    ...typography.titleMd,
  },
  sectionBody: {
    color: palette.textSecondary,
    ...typography.body,
    marginTop: 12,
  },
});
