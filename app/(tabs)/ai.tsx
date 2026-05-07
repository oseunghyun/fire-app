import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HandDrawnCard, Header, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';

const sections = [
  {
    key: 'summary',
    title: '이번 달 한 줄 평가',
    body: '이번 달 저축률이 크루 상위권 수준. 속도만 유지해도 달성 가능성은 충분해요 🔥',
  },
  {
    key: 'risk',
    title: '핵심 리스크',
    body: '자녀 교육비 시점이 2년 후 증가할 예정. 비상예산을 미리 확보해 변동성을 줄이는 편이 안전해요.',
  },
  {
    key: 'strategy',
    title: '실행 전략 3가지',
    body: '1. 자동차 50%로 줄이기\n2. 보험료 구조 재정리\n3. 외식비 월 2회만 줄여도 파이어 시점이 더 당겨져요.',
  },
  {
    key: 'local',
    title: '한국 맞춤 팁',
    body: 'ISA 비과세 한도와 IRP 세액공제 한도를 분리해서 챙기면 절세 효율이 훨씬 좋아집니다.',
  },
];

export default function AiScreen() {
  const [openKey, setOpenKey] = useState<string | null>('summary');

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="AI 월간 리포트" title="AI가 분석 중..." />

        <HandDrawnCard accent="#FFF8F2" style={styles.loadingCard}>
          <View style={styles.loadingRow}>
            <View style={styles.robotBubble}>
              <Text style={styles.robot}>🤖</Text>
            </View>
            <View style={styles.loadingCopy}>
              <Text style={styles.loadingTitle}>AI가 분석 중...</Text>
              <Text style={styles.loadingBody}>이번 달 흐름, 리스크, 한국형 절세 팁까지 한 번에 정리했어요.</Text>
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  robot: {
    fontSize: 28,
  },
  loadingCopy: {
    flex: 1,
  },
  loadingTitle: {
    color: palette.textPrimary,
    fontSize: 24,
    fontWeight: '900',
  },
  loadingBody: {
    color: palette.textSecondary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 23,
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
    fontSize: 20,
    fontWeight: '900',
  },
  sectionBody: {
    color: palette.textSecondary,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
    marginTop: 12,
  },
});
