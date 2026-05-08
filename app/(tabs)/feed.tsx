import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FireMascot, HandDrawnCard, Header, PillBadge, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';

const filters = ['전체', '달성 후기', '고민', '팁'];

const posts = [
  {
    id: '1',
    tag: '달성 후기',
    title: '드디어 FIRE까지 10년 깨졌어요! 🔥',
    meta: '#35세 맞벌이 #리밸런싱',
    likes: 124,
    comments: 32,
    mascot: 'happy' as const,
  },
  {
    id: '2',
    tag: '고민',
    title: '자녀 교육비 때문에 저축률이 너무 낮아졌어요 ㅠㅠ',
    meta: '#자녀교육 #맞벌이',
    likes: 68,
    comments: 15,
    mascot: 'spark' as const,
  },
  {
    id: '3',
    tag: '팁',
    title: 'ISA + IRP 조합으로 세금 아끼는 방법 공유해요!',
    meta: '#ISA #IRP #연말정산',
    likes: 89,
    comments: 21,
    mascot: 'cheer' as const,
  },
];

export default function FeedScreen() {
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="파이어 피드" title="짧고 귀여운 FIRE 근황" />

        <View style={styles.filterRow}>
          {filters.map((filter, index) => (
            <PillBadge key={filter} label={filter} active={index === 0} />
          ))}
        </View>

        {posts.map((post, index) => (
          <HandDrawnCard key={post.id} style={styles.postCard} tilt={index % 2 === 0 ? -1 : 1}>
            <View style={styles.postTop}>
              <PillBadge label={post.tag} active={post.tag === '달성 후기'} />
              <Text style={styles.meta}>{post.meta}</Text>
            </View>
            <View style={styles.postBodyRow}>
              <View style={styles.postCopy}>
                <Text style={styles.postTitle}>{post.title}</Text>
              </View>
              <FireMascot size={54} mood={post.mascot} />
            </View>
            <View style={styles.postActions}>
              <View style={styles.action}>
                <MaterialIcons name="favorite-border" size={18} color={palette.textSecondary} />
                <Text style={styles.actionText}>{post.likes}</Text>
              </View>
              <View style={styles.action}>
                <MaterialIcons name="chat-bubble-outline" size={18} color={palette.textSecondary} />
                <Text style={styles.actionText}>{post.comments}</Text>
              </View>
            </View>
          </HandDrawnCard>
        ))}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 116,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  postCard: {
    marginTop: 14,
  },
  postTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  meta: {
    color: palette.textSecondary,
    ...typography.label,
  },
  postBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  postCopy: {
    flex: 1,
  },
  postTitle: {
    color: palette.textPrimary,
    ...typography.titleMd,
  },
  postActions: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 12,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: palette.textSecondary,
    ...typography.bodySm,
  },
});
