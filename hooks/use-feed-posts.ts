import { useEffect, useState } from 'react';

import { fetchFeedPosts } from '@/lib/fireData';
import { FeedPost } from '@/lib/householdInsights';

export function useFeedPosts(userId?: string | null) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!userId) {
        if (isMounted) {
          setPosts([]);
          setError(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextPosts = await fetchFeedPosts(userId);

        if (isMounted) {
          setPosts(nextPosts);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : '피드 데이터를 불러오지 못했어요.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  async function refresh() {
    if (!userId) {
      setPosts([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextPosts = await fetchFeedPosts(userId);
      setPosts(nextPosts);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '피드 데이터를 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    posts,
    isLoading,
    error,
    refresh,
  };
}
