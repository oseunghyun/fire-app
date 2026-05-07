import { FireResult, Household } from '@/lib/fireCalculator';
import { supabase } from '@/lib/supabase';

export type SharedSnapshotPayload = {
  userId: string;
  householdId?: string | null;
  yearMonth: string;
  fireResult: FireResult;
};

export async function upsertProfile(userId: string, displayName?: string | null) {
  const client = supabase;

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await client.from('profiles').upsert({
    id: userId,
    display_name: displayName ?? null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}

export async function upsertHouseholdSummary(userId: string, household: Household) {
  const client = supabase;

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await client
    .from('households')
    .upsert({
      owner_id: userId,
      type: household.type,
      member_count: household.members.length,
      child_count: household.children.length,
      withdrawal_rate: household.settings.withdrawalRate,
      expected_annual_return: household.settings.expectedAnnualReturn,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function upsertSharedMonthlySnapshot({
  userId,
  householdId,
  yearMonth,
  fireResult,
}: SharedSnapshotPayload) {
  const client = supabase;

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await client.from('monthly_snapshots').upsert(
    {
      user_id: userId,
      household_id: householdId ?? null,
      year_month: yearMonth,
      savings_rate: Math.round(fireResult.savingsRate),
      achievement_rate: Math.round(fireResult.achievementRate),
      fire_distance_months: Number.isFinite(fireResult.monthsToFire) ? fireResult.monthsToFire : 9999,
      target_year: Number.isFinite(fireResult.monthsToFire)
        ? new Date().getFullYear() + Math.ceil(fireResult.monthsToFire / 12)
        : null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,year_month',
    },
  );

  if (error) {
    throw error;
  }
}
