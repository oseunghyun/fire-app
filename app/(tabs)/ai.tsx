import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FireMascot, HandDrawnCard, Header, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { isMockProvider } from '@/lib/aiReport';
import type { AiReport, AiReportRiskItem, AiReportStrategyItem, PartialAiReport } from '@/lib/aiReport';
import { calculateFireResult, formatFireDistance, formatPercent } from '@/lib/fireCalculator';
import { getCrewRanking } from '@/lib/householdInsights';
import { useAiReportStore } from '@/store/aiReportStore';
import { useHouseholdStore } from '@/store/householdStore';

type SectionKey = 'summary' | 'risks' | 'strategies' | 'localTips';

const SECTION_TITLES: Record<SectionKey, string> = {
  summary: '이번 달 한 줄 평가',
  risks: '핵심 리스크',
  strategies: '실행 전략 3가지',
  localTips: '한국 맞춤 팁',
};

export default function AiScreen() {
  const household = useHouseholdStore((state) => state.household);
  const fireResult = useMemo(() => calculateFireResult(household), [household]);
  const crewRanking = useMemo(() => getCrewRanking(fireResult), [fireResult]);

  const status = useAiReportStore((state) => state.status);
  const report = useAiReportStore((state) => state.report);
  const partial = useAiReportStore((state) => state.partial);
  const error = useAiReportStore((state) => state.error);
  const hasHydrated = useAiReportStore((state) => state.hasHydrated);
  const hydrate = useAiReportStore((state) => state.hydrate);
  const generate = useAiReportStore((state) => state.generate);
  const cancel = useAiReportStore((state) => state.cancel);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const [openKey, setOpenKey] = useState<SectionKey | null>('summary');

  const view: PartialAiReport | AiReport | null = status === 'streaming' ? partial : report;
  const isStreaming = status === 'streaming';

  const handleGenerate = () => {
    void generate({ household, fireResult, crewRanking });
    setOpenKey('summary');
  };

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header
          eyebrow="AI 월간 리포트"
          title={titleForStatus(status)}
          right={<FireMascot size={60} mood={moodForStatus(status)} />}
        />

        <HandDrawnCard accent={palette.softOrange} style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.mascotBubble}>
              <FireMascot size={52} mood={moodForStatus(status)} />
            </View>
            <View style={styles.statusCopy}>
              <Text style={styles.statusTitle}>{titleForStatus(status)}</Text>
              <Text style={styles.statusBody}>
                {bodyForStatus(status, fireResult.savingsRate, fireResult.monthsToFire, view?.generatedAt)}
              </Text>
            </View>
            {isStreaming ? <ActivityIndicator color={palette.primary} /> : null}
          </View>

          <View style={styles.actionsRow}>
            {isStreaming ? (
              <Pressable style={[styles.cta, styles.ctaSecondary]} onPress={cancel}>
                <Text style={styles.ctaSecondaryText}>중단</Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.cta, !hasHydrated && styles.ctaDisabled]}
                disabled={!hasHydrated}
                onPress={handleGenerate}
              >
                <MaterialIcons name="auto-awesome" size={18} color="#fff" />
                <Text style={styles.ctaText}>{report ? '다시 생성' : '리포트 생성'}</Text>
              </Pressable>
            )}
          </View>

          {isMockProvider ? (
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>demo mode · 실 API 연결 전</Text>
            </View>
          ) : null}
        </HandDrawnCard>

        {error ? (
          <HandDrawnCard accent={palette.softCoral} style={styles.errorCard}>
            <Text style={styles.errorTitle}>리포트를 만들지 못했어요</Text>
            <Text style={styles.errorBody}>{error.message}</Text>
            <Pressable style={[styles.cta, styles.ctaInline]} onPress={handleGenerate}>
              <Text style={styles.ctaText}>다시 시도</Text>
            </Pressable>
          </HandDrawnCard>
        ) : null}

        {view ? (
          <ReportSections view={view} openKey={openKey} onToggle={setOpenKey} streaming={isStreaming} />
        ) : status === 'idle' && !error ? (
          <HandDrawnCard style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>아직 생성된 리포트가 없어요</Text>
            <Text style={styles.emptyBody}>
              위의 &apos;리포트 생성&apos; 버튼을 누르면 이번 달 가구 데이터와 크루 랭킹을 합쳐 4섹션 리포트를 만들어드려요.
            </Text>
          </HandDrawnCard>
        ) : null}
      </ScrollView>
    </ScreenShell>
  );
}

function ReportSections({
  view,
  openKey,
  onToggle,
  streaming,
}: {
  view: PartialAiReport | AiReport;
  openKey: SectionKey | null;
  onToggle: (key: SectionKey | null) => void;
  streaming: boolean;
}) {
  return (
    <>
      {(['summary', 'risks', 'strategies', 'localTips'] as SectionKey[]).map((key) => {
        const isOpen = openKey === key;
        const ready = isSectionReady(view.sections, key);
        const showCard = ready || streaming;
        if (!showCard) return null;

        return (
          <HandDrawnCard key={key} style={styles.sectionCard} tilt={isOpen ? -0.5 : 0.5}>
            <Pressable style={styles.sectionHead} onPress={() => onToggle(isOpen ? null : key)}>
              <Text style={styles.sectionTitle}>
                {SECTION_TITLES[key]}
                {!ready && streaming ? ' · 작성 중' : ''}
              </Text>
              <MaterialIcons
                name={isOpen ? 'expand-less' : 'expand-more'}
                size={24}
                color={palette.textPrimary}
              />
            </Pressable>
            {isOpen ? <SectionBody sections={view.sections} sectionKey={key} streaming={streaming} /> : null}
          </HandDrawnCard>
        );
      })}
    </>
  );
}

function SectionBody({
  sections,
  sectionKey,
  streaming,
}: {
  sections: PartialAiReport['sections'];
  sectionKey: SectionKey;
  streaming: boolean;
}) {
  if (sectionKey === 'summary') {
    const text = sections.summary ?? '';
    return (
      <Text style={styles.sectionBody}>
        {text}
        {streaming && !text ? '...' : ''}
      </Text>
    );
  }

  if (sectionKey === 'localTips') {
    const text = sections.localTips ?? '';
    return (
      <Text style={styles.sectionBody}>
        {text}
        {streaming && !text ? '...' : ''}
      </Text>
    );
  }

  if (sectionKey === 'risks') {
    const items: AiReportRiskItem[] = sections.risks ?? [];
    if (items.length === 0) {
      return <Text style={styles.sectionBody}>리스크 분석 중...</Text>;
    }
    return (
      <View style={styles.itemList}>
        {items.map((item, idx) => (
          <View key={idx} style={styles.item}>
            <Text style={styles.itemTitle}>
              {idx + 1}. {item.title}
            </Text>
            <Text style={styles.itemBody}>{item.body}</Text>
          </View>
        ))}
      </View>
    );
  }

  const strategies: AiReportStrategyItem[] = sections.strategies ?? [];
  if (strategies.length === 0) {
    return <Text style={styles.sectionBody}>실행 전략 정리 중...</Text>;
  }
  return (
    <View style={styles.itemList}>
      {strategies.map((item, idx) => (
        <View key={idx} style={styles.item}>
          <Text style={styles.itemTitle}>
            {idx + 1}. {item.title}
            {item.impactMonths ? `  ·  -${item.impactMonths}개월` : ''}
          </Text>
          <Text style={styles.itemBody}>{item.body}</Text>
        </View>
      ))}
    </View>
  );
}

function isSectionReady(sections: PartialAiReport['sections'], key: SectionKey) {
  if (key === 'summary') return Boolean(sections.summary && sections.summary.length > 0);
  if (key === 'localTips') return Boolean(sections.localTips && sections.localTips.length > 0);
  if (key === 'risks') return (sections.risks?.length ?? 0) > 0;
  return (sections.strategies?.length ?? 0) > 0;
}

function titleForStatus(status: ReturnType<typeof useAiReportStore.getState>['status']) {
  switch (status) {
    case 'streaming':
      return 'AI가 분석 중...';
    case 'done':
      return '이번 달 리포트';
    case 'error':
      return '잠시 멈췄어요';
    default:
      return 'AI 월간 리포트';
  }
}

function moodForStatus(status: ReturnType<typeof useAiReportStore.getState>['status']) {
  if (status === 'streaming') return 'analyzing' as const;
  if (status === 'error') return 'tired' as const;
  if (status === 'done') return 'winner' as const;
  return 'spark' as const;
}

function bodyForStatus(status: string, savingsRate: number, monthsToFire: number, generatedAt?: string) {
  if (status === 'streaming') {
    return `이번 달 저축률 ${formatPercent(savingsRate)}, FIRE까지 ${formatFireDistance(monthsToFire)} 기준으로 정리하고 있어요.`;
  }
  if (status === 'done' && generatedAt) {
    const date = new Date(generatedAt);
    const stamp = `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${stamp} 기준 · 저축률 ${formatPercent(savingsRate)} · FIRE까지 ${formatFireDistance(monthsToFire)}`;
  }
  if (status === 'error') {
    return '연결이 끊겼거나 응답을 해석하지 못했어요. 다시 시도해주세요.';
  }
  return `이번 달 저축률 ${formatPercent(savingsRate)}, FIRE까지 ${formatFireDistance(monthsToFire)}.`;
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 116,
  },
  statusCard: {
    marginTop: 12,
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mascotBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCopy: {
    flex: 1,
  },
  statusTitle: {
    color: palette.textPrimary,
    ...typography.displayMd,
  },
  statusBody: {
    color: palette.textSecondary,
    ...typography.sticker,
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ctaInline: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  ctaSecondary: {
    backgroundColor: palette.softNeutral,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#fff',
    ...typography.label,
  },
  ctaSecondaryText: {
    color: palette.textPrimary,
    ...typography.label,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: palette.softHighlight,
    borderRadius: 999,
  },
  demoBadgeText: {
    color: palette.textPrimary,
    ...typography.sticker,
  },
  emptyCard: {
    marginTop: 14,
    gap: 8,
  },
  emptyTitle: {
    color: palette.textPrimary,
    ...typography.titleMd,
  },
  emptyBody: {
    color: palette.textSecondary,
    ...typography.body,
  },
  errorCard: {
    marginTop: 14,
    gap: 6,
  },
  errorTitle: {
    color: palette.textPrimary,
    ...typography.titleMd,
  },
  errorBody: {
    color: palette.textSecondary,
    ...typography.body,
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
  itemList: {
    marginTop: 12,
    gap: 12,
  },
  item: {
    gap: 4,
  },
  itemTitle: {
    color: palette.textPrimary,
    ...typography.label,
  },
  itemBody: {
    color: palette.textSecondary,
    ...typography.body,
  },
});
