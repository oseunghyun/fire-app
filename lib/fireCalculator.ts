export type HouseholdType = 'single' | 'coupleDualIncome' | 'coupleSingleIncome' | 'coupleWithChildren';

export type Member = {
  id: 'self' | 'partner';
  name: string;
  age: number;
  goalRetirementAge: number;
  monthlyIncome: number;
  monthlyExpense: number;
  currentAssets: number;
  passiveIncomeMonthly: number;
};

export type Child = {
  id: string;
  name: string;
  age: number;
  independenceAge: number;
  monthlyCost: number;
};

export type FireSettings = {
  withdrawalRate: number;
  expectedAnnualReturn: number;
  inflationRate: number;
};

export type MonthlySnapshot = {
  yearMonth: string;
  totalAssets: number;
  savedMonths: number;
};

export type Household = {
  type: HouseholdType;
  sharedMonthlyExpense: number;
  members: Member[];
  children: Child[];
  settings: FireSettings;
  monthlySnapshots: MonthlySnapshot[];
};

export type FireResult = {
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
  savingsRate: number;
  passiveIncomeMonthly: number;
  currentAssets: number;
  fireTargetAmount: number;
  achievementRate: number;
  monthsToFire: number;
  savedMonthsThisMonth: number;
};

const MAX_SIMULATION_MONTHS = 80 * 12;

export function calculateFireResult(household: Household): FireResult {
  const monthlyIncome = sum(household.members.map((member) => member.monthlyIncome));
  const memberExpense = sum(household.members.map((member) => member.monthlyExpense));
  const childExpense = getChildExpenseAtMonth(household.children, 0);
  const monthlyExpense = memberExpense + household.sharedMonthlyExpense + childExpense;
  const monthlySavings = monthlyIncome - monthlyExpense;
  const passiveIncomeMonthly = sum(household.members.map((member) => member.passiveIncomeMonthly));
  const currentAssets = sum(household.members.map((member) => member.currentAssets));
  const fireTargetAmount = getFireTargetAmount(monthlyExpense, passiveIncomeMonthly, household.settings.withdrawalRate);
  const achievementRate = fireTargetAmount === 0 ? 100 : clamp((currentAssets / fireTargetAmount) * 100, 0, 100);
  const monthsToFire = simulateMonthsToFire(household);
  const latestSnapshot = household.monthlySnapshots.at(-1);

  return {
    monthlyIncome,
    monthlyExpense,
    monthlySavings,
    savingsRate: monthlyIncome <= 0 ? 0 : clamp((monthlySavings / monthlyIncome) * 100, 0, 100),
    passiveIncomeMonthly,
    currentAssets,
    fireTargetAmount,
    achievementRate,
    monthsToFire,
    savedMonthsThisMonth: latestSnapshot?.savedMonths ?? 0,
  };
}

export function formatWon(value: number) {
  return `₩ ${Math.round(value).toLocaleString('ko-KR')}`;
}

export function formatCompactWon(value: number) {
  const hundredMillion = 100_000_000;
  const tenThousand = 10_000;

  if (value >= hundredMillion) {
    const units = value / hundredMillion;
    return `${formatOneDecimal(units)}억`;
  }

  return `${Math.round(value / tenThousand).toLocaleString('ko-KR')}만원`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatFireDistance(months: number) {
  if (!Number.isFinite(months)) {
    return '계산 필요';
  }

  if (months <= 0) {
    return '가능';
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths}개월`;
  }

  if (remainingMonths === 0) {
    return `${years}년`;
  }

  return `${years}년 ${remainingMonths}개월`;
}

function simulateMonthsToFire(household: Household) {
  let assets = sum(household.members.map((member) => member.currentAssets));
  const monthlyIncome = sum(household.members.map((member) => member.monthlyIncome));
  const memberExpense = sum(household.members.map((member) => member.monthlyExpense));
  const passiveIncomeMonthly = sum(household.members.map((member) => member.passiveIncomeMonthly));
  const monthlyReturn = Math.pow(1 + household.settings.expectedAnnualReturn, 1 / 12) - 1;

  for (let month = 0; month <= MAX_SIMULATION_MONTHS; month += 1) {
    const childExpense = getChildExpenseAtMonth(household.children, month);
    const monthlyExpense = memberExpense + household.sharedMonthlyExpense + childExpense;
    const targetAmount = getFireTargetAmount(monthlyExpense, passiveIncomeMonthly, household.settings.withdrawalRate);

    if (assets >= targetAmount) {
      return month;
    }

    const monthlySavings = monthlyIncome - monthlyExpense;
    assets = assets * (1 + monthlyReturn) + monthlySavings;

    if (assets < 0 && monthlySavings <= 0) {
      return Number.POSITIVE_INFINITY;
    }
  }

  return Number.POSITIVE_INFINITY;
}

function getFireTargetAmount(monthlyExpense: number, passiveIncomeMonthly: number, withdrawalRate: number) {
  const annualGap = Math.max(0, (monthlyExpense - passiveIncomeMonthly) * 12);
  return annualGap / withdrawalRate;
}

function getChildExpenseAtMonth(children: Child[], month: number) {
  return sum(
    children.map((child) => {
      const monthsUntilIndependence = Math.max(0, child.independenceAge - child.age) * 12;
      return month < monthsUntilIndependence ? child.monthlyCost : 0;
    }),
  );
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatOneDecimal(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
