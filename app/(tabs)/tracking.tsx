import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FireMascot, HandDrawnCard, Header, PillButton, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { formatWon } from '@/lib/fireCalculator';
import { fireResult } from '@/lib/sampleData';

export default function TrackingScreen() {
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="월간 자산 입력" title="이번 달 총 금융자산은 얼마인가요?" />

        <HandDrawnCard style={styles.inputCard}>
          <Text style={styles.subtle}>(부동산 제외)</Text>
          <Text style={styles.amount}>{formatWon(fireResult.currentAssets)}</Text>
          <View style={styles.quickButtons}>
            <PillButton label="+100만원" />
            <PillButton label="+500만원" />
            <PillButton label="직접 입력" />
          </View>
          <PillButton label="저장하고 분석하기 →" primary style={styles.cta} />
        </HandDrawnCard>

        <HandDrawnCard accent={palette.softOrange} style={styles.helperCard} tilt={-1}>
          <View style={styles.helperRow}>
            <FireMascot size={64} mood="happy" />
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
  amount: {
    color: palette.textPrimary,
    ...typography.numberXl,
    marginTop: 18,
    textAlign: 'center',
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
