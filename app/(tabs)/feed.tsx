import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FireMascot, HandDrawnCard, Header, PillBadge, PillButton, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { typography } from '@/constants/typography';
import { useAuth } from '@/hooks/use-auth';
import { useFeedPosts } from '@/hooks/use-feed-posts';
import { createFeedPost, ensureDefaultCrew } from '@/lib/fireData';
import { FeedPost, FeedTag, getFeedPosts } from '@/lib/householdInsights';
import { useHouseholdStore } from '@/store/householdStore';

const filters: FeedTag[] = ['전체', '달성 후기', '고민', '팁'];

export default function FeedScreen() {
  const household = useHouseholdStore((state) => state.household);
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FeedTag>('전체');
  const [syncMessage, setSyncMessage] = useState('');
  const localPosts = getFeedPosts(household);
  const { posts: remotePosts, isLoading, error, refresh } = useFeedPosts(user?.id);
  const posts = remotePosts.length > 0 ? remotePosts : localPosts;
  const filteredPosts = posts.filter((post) => activeFilter === '전체' || post.tag === activeFilter);

  async function handlePublishPost() {
    if (!user) {
      setSyncMessage('로그인 후에 크루 피드에 근황을 올릴 수 있어요.');
      return;
    }

    setSyncMessage('');

    try {
      const crewId = await ensureDefaultCrew(user.id, household);
      const latestPost = buildPostDraft(localPosts[0]);

      await createFeedPost({
        userId: user.id,
        crewId,
        authorNickname: user.email?.split('@')[0] ?? '파이어러',
        category: latestPost.tag,
        title: latestPost.title,
        periodLabel: latestPost.meta,
        mascotMood: latestPost.mascot,
      });

      await refresh();
      setSyncMessage('지금 FIRE 근황을 크루 피드에 올렸어요.');
    } catch (publishError) {
      setSyncMessage(publishError instanceof Error ? publishError.message : '피드 업로드에 실패했어요.');
    }
  }

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

        <HandDrawnCard accent={palette.softCream} style={styles.syncCard} tilt={-1}>
          <Text style={styles.syncTitle}>우리 근황도 올려볼까요?</Text>
          <Text style={styles.syncBody}>
            {remotePosts.length > 0 ? '서버 피드를 우선 보여주고 있어요.' : '아직 서버 게시물이 없으면 로컬 근황 목업을 먼저 보여줘요.'}
          </Text>
          <View style={styles.syncActions}>
            <PillButton label={user ? (isLoading ? '불러오는 중...' : '내 근황 올리기') : '로그인 후 올리기'} onPress={handlePublishPost} />
          </View>
          {syncMessage || error ? <Text style={styles.syncMessage}>{syncMessage || error}</Text> : null}
        </HandDrawnCard>

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
  syncCard: {
    marginTop: 14,
  },
  syncTitle: {
    color: palette.textPrimary,
    ...typography.titleMd,
  },
  syncBody: {
    color: palette.textSecondary,
    ...typography.bodySm,
    marginTop: 8,
  },
  syncActions: {
    marginTop: 12,
  },
  syncMessage: {
    color: palette.primary,
    ...typography.bodySm,
    marginTop: 10,
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

function buildPostDraft(post: FeedPost | undefined) {
  return (
    post ?? {
      id: 'draft',
      tag: '팁',
      title: '이번 달 FIRE 근황을 간단히 남겨봤어요.',
      meta: '#월간트래킹',
      likes: 0,
      comments: 0,
      mascot: 'saving',
    }
  );
}
