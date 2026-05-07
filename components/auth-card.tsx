import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { palette } from '@/constants/fire-theme';
import { useAuth } from '@/hooks/use-auth';
import { upsertHouseholdSummary, upsertProfile, upsertSharedMonthlySnapshot } from '@/lib/fireData';
import { fireResult, household } from '@/lib/sampleData';

export function AuthCard() {
  const { isConfigured, isLoading, session, signInWithEmail, signOut, user } = useAuth();
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
      setMessage('공유용 월간 스냅샷을 저장했어요.');
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
        <Text style={styles.label}>Supabase 연결 대기</Text>
        <Text style={styles.body}>`.env`에 Supabase URL과 anon key를 넣으면 로그인과 공유 스냅샷 저장이 활성화됩니다.</Text>
      </View>
    );
  }

  if (session) {
    return (
      <View style={styles.card}>
        <Text style={styles.label}>로그인됨</Text>
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
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF8F5',
    borderColor: palette.ink,
    borderRadius: 24,
    borderWidth: 2,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
  },
  label: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '900',
  },
  title: {
    color: palette.ink,
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 30,
    marginTop: 8,
  },
  body: {
    color: '#4D4B46',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: palette.ink,
    borderRadius: 16,
    borderWidth: 2,
    color: palette.ink,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  button: {
    alignItems: 'center',
    backgroundColor: palette.ink,
    borderRadius: 999,
    marginTop: 12,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  message: {
    color: palette.coral,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 10,
  },
});
