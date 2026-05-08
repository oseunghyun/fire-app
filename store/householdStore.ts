import { create } from 'zustand';

import { calculateFireResult, Child, FireSettings, Household, HouseholdType, Member, MonthlySnapshot } from '@/lib/fireCalculator';
import { getLocalHouseholdDraft, saveLocalHouseholdDraft } from '@/lib/localFinanceStorage';

type PersistedHouseholdDraft = {
  hasCompletedOnboarding: boolean;
  household: Household;
};

type HouseholdStore = {
  hasHydrated: boolean;
  hasCompletedOnboarding: boolean;
  household: Household;
  hydrate: () => Promise<void>;
  resetHousehold: (type?: HouseholdType) => void;
  setHouseholdType: (type: HouseholdType) => void;
  updateMember: (memberId: Member['id'], patch: Partial<Member>) => void;
  updateChild: (childId: string, patch: Partial<Child>) => void;
  addChild: () => void;
  removeChild: (childId: string) => void;
  updateSettings: (patch: Partial<FireSettings>) => void;
  setSharedMonthlyExpense: (value: number) => void;
  setHouseholdCurrentAssets: (totalAssets: number) => void;
  appendMonthlySnapshot: (snapshot: MonthlySnapshot) => void;
  completeOnboarding: () => void;
};

const defaultSettings: FireSettings = {
  withdrawalRate: 0.04,
  expectedAnnualReturn: 0.045,
  inflationRate: 0.02,
};

function createMember(id: Member['id']): Member {
  return {
    id,
    name: id === 'self' ? '나' : '배우자',
    age: id === 'self' ? 34 : 33,
    goalRetirementAge: id === 'self' ? 52 : 55,
    monthlyIncome: id === 'self' ? 4_800_000 : 3_900_000,
    monthlyExpense: id === 'self' ? 1_600_000 : 1_200_000,
    currentAssets: id === 'self' ? 120_000_000 : 80_000_000,
    passiveIncomeMonthly: id === 'self' ? 100_000 : 0,
  };
}

function createChild(index: number): Child {
  return {
    id: `child-${index + 1}`,
    name: `자녀 ${index + 1}`,
    age: 6 + index * 3,
    independenceAge: 24,
    monthlyCost: 700_000,
  };
}

function createDefaultHousehold(type: HouseholdType = 'coupleWithChildren'): Household {
  return {
    type,
    sharedMonthlyExpense: type === 'single' ? 750_000 : 1_900_000,
    members: type === 'single' ? [createMember('self')] : [createMember('self'), createMember('partner')],
    children: type === 'coupleWithChildren' ? [createChild(0)] : [],
    settings: defaultSettings,
    monthlySnapshots: [],
  };
}

function normalizeHouseholdType(type: HouseholdType, household: Household): Household {
  const self = household.members.find((member) => member.id === 'self') ?? createMember('self');
  const partner = household.members.find((member) => member.id === 'partner') ?? createMember('partner');

  return {
    ...household,
    type,
    members: type === 'single' ? [self] : [self, partner],
    children: type === 'coupleWithChildren' ? (household.children.length > 0 ? household.children : [createChild(0)]) : [],
  };
}

function safeNumber(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function persistDraft(draft: PersistedHouseholdDraft) {
  void saveLocalHouseholdDraft(draft);
}

export function selectFireResult(household: Household) {
  return calculateFireResult(household);
}

export const useHouseholdStore = create<HouseholdStore>((set, get) => ({
  hasHydrated: false,
  hasCompletedOnboarding: false,
  household: createDefaultHousehold(),
  hydrate: async () => {
    const draft = await getLocalHouseholdDraft<PersistedHouseholdDraft>();

    if (draft?.household) {
      set({
        hasCompletedOnboarding: draft.hasCompletedOnboarding,
        household: draft.household,
        hasHydrated: true,
      });
      return;
    }

    set({ hasHydrated: true });
  },
  resetHousehold: (type = 'coupleWithChildren') => {
    const household = createDefaultHousehold(type);
    set({ household, hasCompletedOnboarding: false });
    persistDraft({ household, hasCompletedOnboarding: false });
  },
  setHouseholdType: (type) => {
    const household = normalizeHouseholdType(type, get().household);
    set({ household });
    persistDraft({ household, hasCompletedOnboarding: get().hasCompletedOnboarding });
  },
  updateMember: (memberId, patch) => {
    const household = {
      ...get().household,
      members: get().household.members.map((member) =>
        member.id === memberId
          ? {
              ...member,
              ...patch,
            }
          : member,
      ),
    };
    set({ household });
    persistDraft({ household, hasCompletedOnboarding: get().hasCompletedOnboarding });
  },
  updateChild: (childId, patch) => {
    const household = {
      ...get().household,
      children: get().household.children.map((child) =>
        child.id === childId
          ? {
              ...child,
              ...patch,
            }
          : child,
      ),
    };
    set({ household });
    persistDraft({ household, hasCompletedOnboarding: get().hasCompletedOnboarding });
  },
  addChild: () => {
    const nextIndex = get().household.children.length;
    const household = {
      ...get().household,
      children: [...get().household.children, createChild(nextIndex)],
    };
    set({ household });
    persistDraft({ household, hasCompletedOnboarding: get().hasCompletedOnboarding });
  },
  removeChild: (childId) => {
    const nextChildren = get().household.children.filter((child) => child.id !== childId);
    const household = {
      ...get().household,
      children: nextChildren,
    };
    set({ household });
    persistDraft({ household, hasCompletedOnboarding: get().hasCompletedOnboarding });
  },
  updateSettings: (patch) => {
    const household = {
      ...get().household,
      settings: {
        ...get().household.settings,
        ...patch,
      },
    };
    set({ household });
    persistDraft({ household, hasCompletedOnboarding: get().hasCompletedOnboarding });
  },
  setSharedMonthlyExpense: (value) => {
    const household = {
      ...get().household,
      sharedMonthlyExpense: safeNumber(value),
    };
    set({ household });
    persistDraft({ household, hasCompletedOnboarding: get().hasCompletedOnboarding });
  },
  setHouseholdCurrentAssets: (totalAssets) => {
    const total = safeNumber(totalAssets);
    const currentTotal = get().household.members.reduce((sum, member) => sum + member.currentAssets, 0);
    const members =
      currentTotal <= 0
        ? get().household.members.map((member, index, membersList) => ({
            ...member,
            currentAssets: Math.round(total / membersList.length) + (index === 0 ? total % membersList.length : 0),
          }))
        : get().household.members.map((member, index, membersList) => {
            const baseValue =
              index === membersList.length - 1
                ? total -
                  membersList.slice(0, -1).reduce((sum, previousMember) => {
                    const ratio = previousMember.currentAssets / currentTotal;
                    return sum + Math.round(total * ratio);
                  }, 0)
                : Math.round(total * (member.currentAssets / currentTotal));

            return {
              ...member,
              currentAssets: baseValue,
            };
          });

    const household = {
      ...get().household,
      members,
    };
    set({ household });
    persistDraft({ household, hasCompletedOnboarding: get().hasCompletedOnboarding });
  },
  appendMonthlySnapshot: (snapshot) => {
    const monthlySnapshots = [...get().household.monthlySnapshots.filter((item) => item.yearMonth !== snapshot.yearMonth), snapshot].sort((a, b) =>
      a.yearMonth.localeCompare(b.yearMonth),
    );
    const household = {
      ...get().household,
      monthlySnapshots,
    };
    set({ household });
    persistDraft({ household, hasCompletedOnboarding: get().hasCompletedOnboarding });
  },
  completeOnboarding: () => {
    const household = get().household;
    set({ hasCompletedOnboarding: true });
    persistDraft({ household, hasCompletedOnboarding: true });
  },
}));
