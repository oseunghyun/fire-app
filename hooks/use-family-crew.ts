import { useEffect, useState } from 'react';

import { CrewSummary, fetchMyFamilyCrew } from '@/lib/fireData';

export function useFamilyCrew(userId?: string | null) {
  const [crew, setCrew] = useState<CrewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!userId) {
        if (isMounted) {
          setCrew(null);
          setError(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMyFamilyCrew(userId);

        if (isMounted) {
          setCrew(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : '크루 데이터를 불러오지 못했어요.');
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
      setCrew(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMyFamilyCrew(userId);
      setCrew(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '크루 데이터를 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    crew,
    isLoading,
    error,
    refresh,
  };
}
