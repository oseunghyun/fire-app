import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const HOUSEHOLD_DRAFT_KEY = 'fire.householdDraft.v1';

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
