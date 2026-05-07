import { calculateFireResult, Household } from '@/lib/fireCalculator';

export const household: Household = {
  type: 'coupleWithChildren',
  sharedMonthlyExpense: 2_300_000,
  members: [
    {
      id: 'self',
      name: '나',
      age: 36,
      monthlyIncome: 6_800_000,
      monthlyExpense: 1_850_000,
      currentAssets: 485_000_000,
      passiveIncomeMonthly: 350_000,
    },
    {
      id: 'partner',
      name: '배우자',
      age: 35,
      monthlyIncome: 5_700_000,
      monthlyExpense: 1_550_000,
      currentAssets: 357_000_000,
      passiveIncomeMonthly: 150_000,
    },
  ],
  children: [
    {
      id: 'child-1',
      name: '자녀 1',
      age: 6,
      independenceAge: 24,
      monthlyCost: 950_000,
    },
  ],
  settings: {
    withdrawalRate: 0.04,
    expectedAnnualReturn: 0.045,
    inflationRate: 0.02,
  },
  monthlySnapshots: [
    {
      yearMonth: '2026-04',
      totalAssets: 826_500_000,
      savedMonths: 1,
    },
    {
      yearMonth: '2026-05',
      totalAssets: 842_000_000,
      savedMonths: 2,
    },
  ],
};

export const fireResult = calculateFireResult(household);

export const crewRanking = [
  { rank: 1, name: '린파이어22', savingsRate: 51 },
  { rank: 2, name: '모아가는집', savingsRate: 49 },
  { rank: 3, name: '우리집', savingsRate: Math.round(fireResult.savingsRate) },
  { rank: 4, name: '느린은퇴', savingsRate: 39 },
];

export const familyContribution = household.members.map((member) => {
  const totalAssets = fireResult.currentAssets || 1;

  return {
    id: member.id,
    name: member.name,
    assetShare: (member.currentAssets / totalAssets) * 100,
  };
});
