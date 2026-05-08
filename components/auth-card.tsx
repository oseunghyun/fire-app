import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { palette } from '@/constants/fire-theme';
import { fontFamily, typography } from '@/constants/typography';
import { useAuth } from '@/hooks/use-auth';
import { calculateFireResult } from '@/lib/fireCalculator';
import { syncCrewMetrics, upsertHouseholdSummary, upsertProfile, upsertSharedMonthlySnapshot } from '@/lib/fireData';
import { useHouseholdStore } from '@/store/householdStore';

export function AuthCard() {
  const { isConfigured, isLoading, session, signInWithEmail, signInWithPassword, signOut, user } = useAuth();
  const household = useHouseholdStore((state) => state.household);
  const fireResult = calculateFireResult(household);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setMessage('');
    setIsSubmitting(true);

    try {
      await signInWithEmail(email.trim());
      setMessage('로그인 링크를 이메일로 보냈어요.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '로그인 요청에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTestLogin() {
    setMessage('');
    setIsSubmitting(true);

    try {
      // 테스트 계정 정보 (Supabase 대시보드에서 이 계정을 생성해야 합니다)
      await signInWithPassword('test@test.com', 'password123');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '테스트 로그인에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setMessage('');
    setIsSubmitting(true);

    try {
      await signOut();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '로그아웃에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSyncSnapshot() {
    if (!user) {
      return;
    }

    setMessage('');
    setIsSubmitting(true);

    try {
      await upsertProfile(user.id, user.email ?? null);
      const householdId = await upsertHouseholdSummary(user.id, household);
      await upsertSharedMonthlySnapshot({
        userId: user.id,
        householdId,
        yearMonth: '2026-05',
        fireResult,
      });
      await syncCrewMetrics({
        userId: user.id,
        nickname: user.email?.split('@')[0] ?? '파이어러',
        household,
        fireResult,
      });
      setMessage('공유용 월간 스냅샷과 크루 기록을 저장했어요.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '스냅샷 저장에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={palette.ink} />
      </View>
    );
  }

  if (!isConfigured) {
    return (
      <View style={styles.card}>
        <Text style={styles.label}>연동 대기</Text>
        <Text style={styles.title}>우리 가족 데이터 연결하기</Text>
        <Text style={styles.body}>`.env`에 Supabase URL과 anon key를 넣으면 로그인과 공유 스냅샷 저장이 켜집니다.</Text>
      </View>
    );
  }

  if (session) {
    return (
      <View style={styles.card}>
        <Text style={styles.label}>연결 완료</Text>
        <Text style={styles.title}>{user?.email ?? 'FIRE 사용자'}</Text>
        <Pressable style={styles.button} onPress={handleSyncSnapshot} disabled={isSubmitting}>
          <Text style={styles.buttonText}>{isSubmitting ? '저장 중' : '이번 달 스냅샷 저장'}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleSignOut} disabled={isSubmitting}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </Pressable>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{isLoading ? '세션 확인 중' : '계정 연결'}</Text>
      <Text style={styles.title}>이메일로 시작하기</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor="#AAA49A"
        style={styles.input}
        value={email}
      />
      <Pressable style={styles.button} onPress={handleSubmit} disabled={!email.trim() || isSubmitting}>
        <Text style={styles.buttonText}>{isSubmitting ? '전송 중' : '로그인 링크 받기'}</Text>
      </Pressable>

      <Pressable 
        style={[styles.button, styles.testButton]} 
        onPress={handleTestLogin} 
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>테스트 계정으로 즉시 로그인</Text>
      </Pressable>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.softCream,
    borderColor: palette.cardLine,
    borderRadius: 24,
    borderWidth: 1.5,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
  },
  label: {
    color: palette.textSecondary,
    ...typography.label,
  },
  title: {
    color: palette.textPrimary,
    ...typography.titleMd,
    marginTop: 8,
  },
  body: {
    color: palette.textSecondary,
    ...typography.bodySm,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: palette.cardLine,
    borderRadius: 16,
    borderWidth: 1.5,
    color: palette.textPrimary,
    fontSize: 16,
    fontFamily: fontFamily.bodyStrong,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  button: {
    alignItems: 'center',
    backgroundColor: palette.textPrimary,
    borderRadius: 16,
    marginTop: 12,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.bodyBold,
  },
  testButton: {
    backgroundColor: palette.primary,
    marginTop: 8,
  },
  message: {
    color: palette.primary,
    ...typography.bodySm,
    marginTop: 10,
  },
});
