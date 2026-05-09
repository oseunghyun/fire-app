import { calculateFireResult, FireResult, formatFireDistance, Household, Member } from '@/lib/fireCalculator';

export type CrewRankingEntry = {
  rank: number;
  name: string;
  savingsRate: number;
  isMe?: boolean;
};

export type FeedTag = '전체' | '달성 후기' | '고민' | '팁';

export type FeedPost = {
  id: string;
  tag: Exclude<FeedTag, '전체'>;
  title: string;
  meta: string;
  likes: number;
  comments: number;
  mascot: 'winner' | 'tired' | 'saving' | 'surprised';
};

export type FeedMascotMood = FeedPost['mascot'];

export function getHouseholdEyebrow(household: Household) {
  const typeLabel =
    household.type === 'single'
      ? '혼자 달리는 중'
      : household.type === 'coupleSingleIncome'
        ? '부부 외벌이'
        : '맞벌이';
  const childLabel = household.children.length > 0 ? ` · 자녀 ${household.children.length}명` : '';

  return `김파이어님, ${typeLabel}${childLabel}`;
}

export function getCrewRanking(fireResult: FireResult): CrewRankingEntry[] {
  const baseEntries: CrewRankingEntry[] = [
    { rank: 0, name: '알뜰한토끼', savingsRate: 56 },
    { rank: 0, name: '절약하는별', savingsRate: 51 },
    { rank: 0, name: '우리집', savingsRate: Math.round(fireResult.savingsRate), isMe: true },
    { rank: 0, name: '천천히은퇴', savingsRate: 42 },
    { rank: 0, name: '월급의마법', savingsRate: 37 },
  ];

  return [...baseEntries]
    .sort((a, b) => b.savingsRate - a.savingsRate)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

export function getCrewInsight(ranking: CrewRankingEntry[]) {
  const me = ranking.find((entry) => entry.isMe) ?? ranking[0];
  const leader = ranking[0];
  const nextAbove = ranking.find((entry) => entry.rank === me.rank - 1);
  const gapToLeader = Math.max(0, leader.savingsRate - me.savingsRate);
  const gapToNext = nextAbove ? Math.max(0, nextAbove.savingsRate - me.savingsRate) : 0;

  return {
    me,
    leader,
    gapToLeader,
    gapToNext,
  };
}

export function getFamilyContribution(household: Household) {
  const totalAssets = household.members.reduce((sum, member) => sum + member.currentAssets, 0) || 1;

  return household.members.map((member) => ({
    id: member.id,
    name: member.name,
    assetShare: (member.currentAssets / totalAssets) * 100,
  }));
}

export function getPartnerComparison(household: Household) {
  const withPartnerMonths = calculateFireResult(household).monthsToFire;

  if (household.members.length <= 1) {
    return {
      withPartnerMonths,
      withoutPartnerMonths: withPartnerMonths,
    };
  }

  const self = household.members.find((member) => member.id === 'self') ?? household.members[0];
  const withoutPartnerHousehold: Household = {
    ...household,
    type: 'single',
    members: [self],
    sharedMonthlyExpense: Math.max(0, Math.round(household.sharedMonthlyExpense * 0.6)),
  };

  return {
    withPartnerMonths,
    withoutPartnerMonths: calculateFireResult(withoutPartnerHousehold).monthsToFire,
  };
}

export function getFeedPosts(household: Household): FeedPost[] {
  const fireResult = calculateFireResult(household);
  const latestSnapshot = household.monthlySnapshots.at(-1);
  const childCount = household.children.length;
  const householdTag = household.members.length > 1 ? '#맞벌이' : '#1인가구';
  const childTag = childCount > 0 ? ` #자녀${childCount}명` : '';

  return [
    {
      id: 'progress',
      tag: '달성 후기',
      title: `이번 달 ${latestSnapshot?.savedMonths ?? 0}개월 단축됐어요. FIRE까지 ${formatFireDistance(fireResult.monthsToFire)} 남았어요!`,
      meta: `${householdTag}${childTag} #저축률${Math.round(fireResult.savingsRate)}`,
      likes: 110 + Math.round(fireResult.savingsRate),
      comments: 18 + household.members.length,
      mascot: 'winner',
    },
    {
      id: 'worry',
      tag: '고민',
      title:
        childCount > 0
          ? '교육비 구간이 다가오는데 저축률을 어떻게 지킬지 고민 중이에요.'
          : '생활비가 자꾸 흔들려서 저축률이 들쭉날쭉해요. 루틴을 다시 잡는 중이에요.',
      meta: `${householdTag}${childTag} #FIRE루틴`,
      likes: 52 + childCount * 8,
      comments: 12 + childCount * 3,
      mascot: 'tired',
    },
    {
      id: 'tip',
      tag: '팁',
      title:
        household.members.length > 1
          ? '부부 공용지출을 따로 모아보니 새는 비용이 보여요. 월간 체크가 꽤 효과적이에요.'
          : '자동이체 날짜를 월급 다음날로 고정하니 저축률 유지가 훨씬 쉬워졌어요.',
      meta: `${householdTag} #월간트래킹 #습관`,
      likes: 74 + Math.round(fireResult.achievementRate / 5),
      comments: 16,
      mascot: 'saving',
    },
  ];
}

export function normalizeFeedMascotMood(value?: string | null): FeedMascotMood {
  if (value === 'winner' || value === 'tired' || value === 'saving' || value === 'surprised') {
    return value;
  }

  return 'saving';
}

export function getMemberAccent(member: Member, index: number) {
  if (member.id === 'self') {
    return index === 0 ? '#8FBE63' : '#FF8A3D';
  }

  return '#FF8A3D';
}
