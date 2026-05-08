import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FireMascot, HandDrawnCard, Header, PillBadge, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { FeedTag, getFeedPosts } from '@/lib/householdInsights';
import { useHouseholdStore } from '@/store/householdStore';

const filters: FeedTag[] = ['전체', '달성 후기', '고민', '팁'];

export default function FeedScreen() {
  const household = useHouseholdStore((state) => state.household);
  const [activeFilter, setActiveFilter] = useState<FeedTag>('전체');
  const posts = getFeedPosts(household);
  const filteredPosts = posts.filter((post) => activeFilter === '전체' || post.tag === activeFilter);

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="파이어 피드" title="짧고 귀여운 FIRE 근황" right={<FireMascot size={58} mood="surprised" />} />

        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <Pressable key={filter} onPress={() => setActiveFilter(filter)}>
              <PillBadge label={filter} active={activeFilter === filter} />
            </Pressable>
          ))}
        </View>

        {filteredPosts.map((post, index) => (
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
