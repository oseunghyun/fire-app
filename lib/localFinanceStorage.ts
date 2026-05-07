import * as SecureStore from 'expo-secure-store';

const HOUSEHOLD_DRAFT_KEY = 'fire.householdDraft.v1';

export async function saveLocalHouseholdDraft(value: unknown) {
  await SecureStore.setItemAsync(HOUSEHOLD_DRAFT_KEY, JSON.stringify(value));
}

export async function getLocalHouseholdDraft<T>() {
  const raw = await SecureStore.getItemAsync(HOUSEHOLD_DRAFT_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function clearLocalHouseholdDraft() {
  await SecureStore.deleteItemAsync(HOUSEHOLD_DRAFT_KEY);
}
