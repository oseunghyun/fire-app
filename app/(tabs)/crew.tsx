import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FlameMark, Header, ProgressBar, ScreenShell, SectionCard } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';

const ranking = [
  ['1', '린파이어22', '51%'],
  ['2', '모아가는집', '46%'],
  ['3', '우리집', '43%'],
  ['4', '느린은퇴', '39%'],
];

export default function CrewScreen() {
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="파이어 크루" title="내 순위 3위" />

        <SectionCard accent="#F4FBEF" style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.label}>30대 맞벌이 크루</Text>
            <Text style={styles.heroTitle}>금액은 숨기고, 속도만 공유</Text>
            <Text style={styles.heroBody}>1위보다 7%p 낮아요. 이번 달 식비 18만원만 줄이면 2위권.</Text>
          </View>
          <FlameMark size={76} label="3" />
        </SectionCard>

        <SectionCard>
          <View style={styles.cardHead}>
            <Text style={styles.sectionTitle}>이달 저축률 랭킹</Text>
            <Text style={styles.label}>금액 비공개</Text>
          </View>
          {ranking.map(([rank, name, rate]) => (
            <View key={rank} style={[styles.rankRow, rank === '3' ? styles.mine : null]}>
              <Text style={styles.rankBadge}>{rank}</Text>
              <Text style={styles.rankName}>{name}</Text>
              <Text style={styles.rankRate}>{rate}</Text>
            </View>
          ))}
        </SectionCard>

        <SectionCard>
          <Text style={styles.sectionTitle}>가족 크루 달성률</Text>
          <View style={styles.memberRow}>
            <Text style={styles.memberName}>나</Text>
            <ProgressBar value={52} color={palette.blue} />
          </View>
          <View style={styles.memberRow}>
            <Text style={styles.memberName}>배우자</Text>
            <ProgressBar value={44} color={palette.green} />
          </View>
        </SectionCard>

        <View style={styles.chatPreview}>
          <Text style={styles.chatText}>“IRP 세액공제 한도 정리한 글 공유했어요.”</Text>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
  },
  hero: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  heroCopy: {
    flex: 1,
  },
  label: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '900',
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: 8,
  },
  heroBody: {
    color: '#4D4B46',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 23,
    marginTop: 10,
  },
  cardHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  rankRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: palette.line,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    padding: 13,
  },
  mine: {
    borderColor: palette.ink,
    backgroundColor: '#F5FAFF',
  },
  rankBadge: {
    backgroundColor: palette.yellow,
    borderRadius: 15,
    color: palette.ink,
    fontSize: 15,
    fontWeight: '900',
    height: 30,
    lineHeight: 30,
    overflow: 'hidden',
    textAlign: 'center',
    width: 30,
  },
  rankName: {
    color: palette.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
  },
  rankRate: {
    color: palette.blue,
    fontSize: 17,
    fontWeight: '900',
  },
  memberRow: {
    gap: 10,
    marginTop: 16,
  },
  memberName: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  chatPreview: {
    backgroundColor: '#F3F0E8',
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 16,
  },
  chatText: {
    color: '#3C3933',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
  },
});
