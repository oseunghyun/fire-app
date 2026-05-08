import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FireMascot, HandDrawnCard, Header, PillButton, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { calculateFireResult, formatWon, Household } from '@/lib/fireCalculator';
import { useHouseholdStore } from '@/store/householdStore';

export default function TrackingScreen() {
  const household = useHouseholdStore((state) => state.household);
  const setHouseholdCurrentAssets = useHouseholdStore((state) => state.setHouseholdCurrentAssets);
  const appendMonthlySnapshot = useHouseholdStore((state) => state.appendMonthlySnapshot);
  const fireResult = calculateFireResult(household);
  const [inputValue, setInputValue] = useState(`${Math.round(fireResult.currentAssets)}`);

  useEffect(() => {
    setInputValue(`${Math.round(fireResult.currentAssets)}`);
  }, [fireResult.currentAssets]);

  function nudgeAmount(amount: number) {
    const current = Number(inputValue) || 0;
    setInputValue(`${Math.max(0, current + amount)}`);
  }

  function handleSave() {
    const nextAssets = Number(inputValue) || 0;
    const previousResult = calculateFireResult(household);
    const nextHousehold = {
      ...household,
      members: distributeAssets(nextAssets, household),
    };
    const nextResult = calculateFireResult(nextHousehold);
    const savedMonths = Math.max(0, previousResult.monthsToFire - nextResult.monthsToFire);
    const yearMonth = new Date().toISOString().slice(0, 7);

    setHouseholdCurrentAssets(nextAssets);
    appendMonthlySnapshot({
      yearMonth,
      totalAssets: nextAssets,
      savedMonths: Number.isFinite(savedMonths) ? Math.round(savedMonths) : 0,
    });
  }

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="월간 자산 입력" title="이번 달 총 금융자산은 얼마인가요?" right={<FireMascot size={60} mood="saving" />} />

        <HandDrawnCard style={styles.inputCard}>
          <Text style={styles.subtle}>(부동산 제외)</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={(value) => setInputValue(value.replace(/[^0-9]/g, ''))}
            style={styles.amountInput}
            value={inputValue}
          />
          <Text style={styles.amountHint}>{formatWon(Number(inputValue) || 0)}</Text>
          <View style={styles.quickButtons}>
            <PillButton label="+100만원" onPress={() => nudgeAmount(1_000_000)} />
            <PillButton label="+500만원" onPress={() => nudgeAmount(5_000_000)} />
            <PillButton label="직접 입력" dark />
          </View>
          <PillButton label="저장하고 분석하기 →" primary style={styles.cta} onPress={handleSave} />
        </HandDrawnCard>

        <HandDrawnCard accent={palette.softOrange} style={styles.helperCard} tilt={-1}>
          <View style={styles.helperRow}>
            <FireMascot size={64} mood="saving" />
            <View style={styles.helperCopy}>
              <Text style={styles.helperTitle}>입력하면 바로</Text>
              <Text style={styles.helperBody}>단축 효과를 보여드릴게요!</Text>
            </View>
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
  inputCard: {
    alignItems: 'center',
    paddingTop: 26,
    paddingBottom: 22,
  },
  subtle: {
    color: palette.textSecondary,
    ...typography.bodySm,
  },
  amountInput: {
    color: palette.textPrimary,
    ...typography.numberXl,
    marginTop: 18,
    textAlign: 'center',
    minWidth: 260,
  },
  amountHint: {
    color: palette.textSecondary,
    ...typography.bodySm,
    marginTop: 8,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 22,
  },
  cta: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  helperCard: {
    marginTop: 18,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  helperCopy: {
    flex: 1,
  },
  helperTitle: {
    color: palette.textPrimary,
    ...typography.displayMd,
  },
  helperBody: {
    color: palette.textSecondary,
    ...typography.sticker,
    marginTop: 6,
  },
});

function distributeAssets(totalAssets: number, household: Household) {
  const currentTotal = household.members.reduce((sum, member) => sum + member.currentAssets, 0);

  if (currentTotal <= 0) {
    return household.members.map((member, index, membersList) => ({
      ...member,
      currentAssets: Math.round(totalAssets / membersList.length) + (index === 0 ? totalAssets % membersList.length : 0),
    }));
  }

  return household.members.map((member, index, membersList) => {
    if (index === membersList.length - 1) {
      const assigned = membersList.slice(0, -1).reduce((sum, previousMember) => {
        const ratio = previousMember.currentAssets / currentTotal;
        return sum + Math.round(totalAssets * ratio);
      }, 0);

      return {
        ...member,
        currentAssets: Math.max(0, totalAssets - assigned),
      };
    }

    return {
      ...member,
      currentAssets: Math.round(totalAssets * (member.currentAssets / currentTotal)),
    };
  });
}
