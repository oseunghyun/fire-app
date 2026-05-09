import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { AiReport } from '@/lib/aiReport/schema';

const HOUSEHOLD_DRAFT_KEY = 'fire.householdDraft.v1';
const AI_REPORT_KEY = 'fire.aiReport.v1';

export async function saveLocalHouseholdDraft(value: unknown) {
  const serialized = JSON.stringify(value);

  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(HOUSEHOLD_DRAFT_KEY, serialized);
    return;
  }

  await SecureStore.setItemAsync(HOUSEHOLD_DRAFT_KEY, serialized);
}

export async function getLocalHouseholdDraft<T>() {
  const raw =
    Platform.OS === 'web'
      ? globalThis.localStorage?.getItem(HOUSEHOLD_DRAFT_KEY) ?? null
      : await SecureStore.getItemAsync(HOUSEHOLD_DRAFT_KEY);

  return raw ? (JSON.parse(raw) as T) : null;
}

export async function clearLocalHouseholdDraft() {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(HOUSEHOLD_DRAFT_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(HOUSEHOLD_DRAFT_KEY);
}

export async function saveLocalAiReport(report: AiReport) {
  const serialized = JSON.stringify(report);

  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(AI_REPORT_KEY, serialized);
    return;
  }

  await AsyncStorage.setItem(AI_REPORT_KEY, serialized);
}

export async function getLocalAiReport(): Promise<AiReport | null> {
  const raw =
    Platform.OS === 'web'
      ? globalThis.localStorage?.getItem(AI_REPORT_KEY) ?? null
      : await AsyncStorage.getItem(AI_REPORT_KEY);

  if (!raw) return null;
  try {
    return JSON.parse(raw) as AiReport;
  } catch {
    return null;
  }
}

export async function clearLocalAiReport() {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(AI_REPORT_KEY);
    return;
  }

  await AsyncStorage.removeItem(AI_REPORT_KEY);
}
