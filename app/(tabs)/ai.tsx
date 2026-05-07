import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FlameMark, Header, PillButton, ScreenShell, SectionCard } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { formatCompactWon, formatPercent } from '@/lib/fireCalculator';
import { fireResult, household } from '@/lib/sampleData';

const firstChild = household.children[0];

export default function AiScreen() {
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="AI 월간 리포트" title="FIRE 코치" />

        <SectionCard accent="#FFF8F5" style={styles.coachCard}>
          <FlameMark size={64} />
          <View style={styles.coachCopy}>
            <Text style={styles.label}>이번 달 한 줄 평가</Text>
            <Text style={styles.coachText}>이 속도면 목표 은퇴 시점을 {fireResult.savedMonthsThisMonth + 12}개월 앞당길 수 있어요.</Text>
          </View>
        </SectionCard>

        <ReportItem label="리스크 01" text={`${firstChild.name} 독립 전까지 월 ${formatCompactWon(firstChild.monthlyCost)} 지출이 유지됩니다. 교육비 상승분은 별도 버퍼로 보는 편이 안전합니다.`} />
        <ReportItem label="전략 02" text={`저축률을 ${formatPercent(fireResult.savingsRate)}에서 ${formatPercent(fireResult.savingsRate + 4)}로 올리면 파이어까지 8개월 더 줄어듭니다.`} />
        <ReportItem label="한국 맞춤 팁" text="IRP와 ISA 한도를 분리해서 연말정산 환급 효과를 먼저 확보하세요." />

        <View style={styles.buttonWrap}>
          <PillButton label="이번 달 체크리스트 보기" dark />
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

function ReportItem({ label, text }: { label: string; text: string }) {
  return (
    <SectionCard>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.reportText}>{text}</Text>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
  },
  coachCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  coachCopy: {
    flex: 1,
  },
  label: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '900',
  },
  coachText: {
    color: palette.ink,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 29,
    marginTop: 8,
  },
  reportText: {
    color: '#36342F',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 26,
    marginTop: 8,
  },
  buttonWrap: {
    marginHorizontal: 20,
    marginTop: 22,
  },
});
