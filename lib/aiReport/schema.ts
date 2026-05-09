import type { FireResult, Household } from '@/lib/fireCalculator';
import type { CrewRankingEntry } from '@/lib/householdInsights';

export type AiReportRiskItem = {
  title: string;
  body: string;
};

export type AiReportStrategyItem = {
  title: string;
  body: string;
  impactMonths?: number;
};

export type AiReportSections = {
  summary: string;
  risks: AiReportRiskItem[];
  strategies: AiReportStrategyItem[];
  localTips: string;
};

export type AiReportContext = {
  savingsRate: number;
  monthsToFire: number;
  achievementRate: number;
  crewRank: number;
  crewSize: number;
  savedMonthsThisMonth: number;
};

export type AiReport = {
  generatedAt: string;
  modelVersion: string;
  context: AiReportContext;
  sections: AiReportSections;
};

export type PartialAiReport = {
  generatedAt: string;
  modelVersion: string;
  context: AiReportContext;
  sections: {
    summary?: string;
    risks?: AiReportRiskItem[];
    strategies?: AiReportStrategyItem[];
    localTips?: string;
  };
};

export type AiReportInput = {
  household: Household;
  fireResult: FireResult;
  crewRanking: CrewRankingEntry[];
};

export const AI_REPORT_SECTION_ORDER: (keyof AiReportSections)[] = [
  'summary',
  'risks',
  'strategies',
  'localTips',
];

export function buildReportContext(
  fireResult: FireResult,
  crewRanking: CrewRankingEntry[],
): AiReportContext {
  const me = crewRanking.find((entry) => entry.isMe) ?? crewRanking[0];

  return {
    savingsRate: Math.round(fireResult.savingsRate),
    monthsToFire: fireResult.monthsToFire,
    achievementRate: Math.round(fireResult.achievementRate),
    crewRank: me?.rank ?? 0,
    crewSize: crewRanking.length,
    savedMonthsThisMonth: fireResult.savedMonthsThisMonth,
  };
}
