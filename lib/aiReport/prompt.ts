import type { AiReportInput } from './schema';

export const AI_REPORT_SYSTEM_PROMPT = `당신은 한국 FIRE(조기은퇴) 가구 코치입니다.
사용자가 보낸 가구 데이터와 크루 랭킹을 바탕으로 친근하고 구체적인 월간 리포트를 작성하세요.

규칙:
- 톤: 친구처럼 단호하지 않게, 격려하되 수치로 말하기.
- 금액 원문은 출력하지 말고 만원 단위 또는 비율(%, 개월)로 표현.
- 한국 환경에 맞는 ISA, IRP, 연금저축, 청약저축, 연말정산 같은 키워드를 적절히 활용.
- 출력은 반드시 아래 JSON 스키마를 정확히 따를 것:

{
  "summary": string,                                     // 한 줄 평가, 60~120자
  "risks": [{ "title": string, "body": string }, ...],   // 정확히 2개
  "strategies": [{ "title": string, "body": string, "impactMonths"?: number }, ...], // 정확히 3개
  "localTips": string                                    // 한국 맞춤 팁, 80~160자
}

설명 텍스트, 마크다운, 코드펜스 없이 순수 JSON만 출력하세요.`;

export function buildUserPrompt(input: AiReportInput): string {
  const { household, fireResult, crewRanking } = input;
  const me = crewRanking.find((entry) => entry.isMe) ?? crewRanking[0];

  const householdLine = describeHousehold(household);
  const childrenLine = household.children.length
    ? household.children
        .map(
          (child) =>
            `${child.name} (${child.age}세, 독립 ${child.independenceAge}세, 월 ${formatWon(child.monthlyCost)})`,
        )
        .join(', ')
    : '없음';

  const rankingLine = crewRanking
    .map((entry) => `${entry.rank}위 ${entry.name} ${entry.savingsRate}%${entry.isMe ? ' (나)' : ''}`)
    .join(' / ');

  const monthsToFire = fireResult.monthsToFire;
  const fireDistance =
    monthsToFire >= 1200
      ? '100년 이상'
      : `${Math.floor(monthsToFire / 12)}년 ${monthsToFire % 12}개월`;

  return `# 가구 정보
- 구성: ${householdLine}
- 자녀: ${childrenLine}
- 가구 공동지출: ${formatWon(household.sharedMonthlyExpense)}
- 합산 월소득: ${formatWon(fireResult.monthlyIncome)}
- 합산 월지출: ${formatWon(fireResult.monthlyExpense)}
- 월 저축액: ${formatWon(fireResult.monthlySavings)}
- 저축률: ${Math.round(fireResult.savingsRate)}%
- 현재 자산: ${formatWon(fireResult.currentAssets)}
- FIRE 목표 자산: ${formatWon(fireResult.fireTargetAmount)}
- 달성률: ${Math.round(fireResult.achievementRate)}%
- 파이어 거리: ${fireDistance}
- 이번 달 단축 개월: ${fireResult.savedMonthsThisMonth}개월

# 크루 랭킹 (저축률 기준)
${rankingLine}
내 순위: ${me?.rank ?? '미참여'} / ${crewRanking.length}

위 데이터를 기반으로 이번 달 AI 리포트를 JSON으로 작성해주세요.`;
}

function describeHousehold(household: AiReportInput['household']) {
  switch (household.type) {
    case 'single':
      return '1인 가구';
    case 'coupleSingleIncome':
      return '부부 외벌이';
    case 'coupleDualIncome':
      return '부부 맞벌이';
    case 'coupleWithChildren':
      return `부부 + 자녀 ${household.children.length}명`;
  }
}

function formatWon(value: number) {
  const won = Math.round(value);
  const tenThousand = Math.round(won / 10_000);
  return `${tenThousand.toLocaleString('ko-KR')}만원`;
}
