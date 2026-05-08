import { FireResult, Household } from '@/lib/fireCalculator';
import { supabase } from '@/lib/supabase';

export type SharedSnapshotPayload = {
  userId: string;
  householdId?: string | null;
  yearMonth: string;
  fireResult: FireResult;
};

export type CrewMemberMetric = {
  userId: string;
  nickname: string;
  savingsRate: number;
  achievementRate: number;
  targetYear: number | null;
};

export type CrewSummary = {
  id: string;
  name: string;
  type: 'family' | 'anonymous';
  fireType: string | null;
  members: CrewMemberMetric[];
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
    }, {
      onConflict: 'owner_id',
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

export async function ensureDefaultCrew(userId: string, household: Household) {
  const client = supabase;

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const { data: existingCrew, error: existingCrewError } = await client
    .from('crews')
    .select('id, name, type, fire_type')
    .eq('owner_id', userId)
    .eq('type', 'family')
    .limit(1)
    .maybeSingle();

  if (existingCrewError) {
    throw existingCrewError;
  }

  if (existingCrew) {
    return existingCrew.id;
  }

  const crewName = household.members.length > 1 ? '우리 가족 FIRE 크루' : '나의 FIRE 크루';
  const fireType = household.type;
  const { data, error } = await client
    .from('crews')
    .insert({
      owner_id: userId,
      name: crewName,
      type: 'family',
      fire_type: fireType,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function upsertCrewMemberMetrics({
  crewId,
  userId,
  nickname,
  fireResult,
}: {
  crewId: string;
  userId: string;
  nickname: string;
  fireResult: FireResult;
}) {
  const client = supabase;

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await client.from('crew_members').upsert(
    {
      crew_id: crewId,
      user_id: userId,
      nickname,
      savings_rate: Math.round(fireResult.savingsRate),
      achievement_rate: Math.round(fireResult.achievementRate),
      target_year: Number.isFinite(fireResult.monthsToFire) ? new Date().getFullYear() + Math.ceil(fireResult.monthsToFire / 12) : null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'crew_id,user_id',
    },
  );

  if (error) {
    throw error;
  }
}

export async function syncCrewMetrics({
  userId,
  nickname,
  household,
  fireResult,
}: {
  userId: string;
  nickname: string;
  household: Household;
  fireResult: FireResult;
}) {
  const crewId = await ensureDefaultCrew(userId, household);
  await upsertCrewMemberMetrics({
    crewId,
    userId,
    nickname,
    fireResult,
  });

  return crewId;
}

export async function fetchMyFamilyCrew(userId: string): Promise<CrewSummary | null> {
  const client = supabase;

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const { data: memberships, error: membershipError } = await client.from('crew_members').select('crew_id').eq('user_id', userId);

  if (membershipError) {
    throw membershipError;
  }

  const crewIds = memberships.map((membership) => membership.crew_id);

  if (crewIds.length === 0) {
    return null;
  }

  const { data: crews, error: crewError } = await client.from('crews').select('id, name, type, fire_type').in('id', crewIds).eq('type', 'family').limit(1);

  if (crewError) {
    throw crewError;
  }

  const crew = crews[0];

  if (!crew) {
    return null;
  }

  const { data: members, error: membersError } = await client
    .from('crew_members')
    .select('user_id, nickname, savings_rate, achievement_rate, target_year')
    .eq('crew_id', crew.id)
    .order('savings_rate', { ascending: false });

  if (membersError) {
    throw membersError;
  }

  return {
    id: crew.id,
    name: crew.name,
    type: crew.type,
    fireType: crew.fire_type,
    members: members.map((member) => ({
      userId: member.user_id,
      nickname: member.nickname,
      savingsRate: member.savings_rate,
      achievementRate: member.achievement_rate,
      targetYear: member.target_year,
    })),
  };
}
