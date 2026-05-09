import { formatFireDistance } from '@/lib/fireCalculator';

import {
  AiReport,
  AiReportInput,
  AiReportRiskItem,
  AiReportStrategyItem,
  buildReportContext,
} from './schema';
import { AiReportStreamer, AiReportStreamEvent } from './streamer';

const MOCK_MODEL_VERSION = 'mock-coach-1';

const STREAM_DELAY_MS = {
  summary: 320,
  risk: 280,
  strategy: 260,
  tip: 360,
};

export const mockStreamer: AiReportStreamer = {
  async *stream(input: AiReportInput, signal?: AbortSignal): AsyncIterable<AiReportStreamEvent> {
    const { fireResult, crewRanking, household } = input;
    const context = buildReportContext(fireResult, crewRanking);

    const sections = buildMockSections(input);

    const partial: AiReport = {
      generatedAt: new Date().toISOString(),
      modelVersion: MOCK_MODEL_VERSION,
      context,
      sections: {
        summary: '',
        risks: [],
        strategies: [],
        localTips: '',
      },
    };

    yield { type: 'partial', report: clone(partial) };

    for (const ch of sections.summary) {
      checkAborted(signal);
      partial.sections.summary += ch;
      if (Math.random() > 0.6) {
        await delay(12, signal);
        yield { type: 'partial', report: clone(partial) };
      }
    }
    yield { type: 'partial', report: clone(partial) };
    await delay(STREAM_DELAY_MS.summary, signal);

    for (const risk of sections.risks) {
      checkAborted(signal);
      partial.sections.risks = [...partial.sections.risks, risk];
      yield { type: 'partial', report: clone(partial) };
      await delay(STREAM_DELAY_MS.risk, signal);
    }

    for (const strategy of sections.strategies) {
      checkAborted(signal);
      partial.sections.strategies = [...partial.sections.strategies, strategy];
      yield { type: 'partial', report: clone(partial) };
      await delay(STREAM_DELAY_MS.strategy, signal);
    }

    for (const ch of sections.localTips) {
      checkAborted(signal);
      partial.sections.localTips += ch;
      if (Math.random() > 0.6) {
        await delay(10, signal);
        yield { type: 'partial', report: clone(partial) };
      }
    }
    await delay(STREAM_DELAY_MS.tip, signal);

    const final: AiReport = {
      generatedAt: partial.generatedAt,
      modelVersion: partial.modelVersion,
      context: partial.context,
      sections: {
        summary: sections.summary,
        risks: sections.risks,
        strategies: sections.strategies,
        localTips: sections.localTips,
      },
    };
    void household;
    yield { type: 'done', report: final };
  },
};

function buildMockSections(input: AiReportInput) {
  const { household, fireResult, crewRanking } = input;
  const me = crewRanking.find((entry) => entry.isMe) ?? crewRanking[0];
  const leader = crewRanking[0];
  const savingsRate = Math.round(fireResult.savingsRate);
  const fireDistance = formatFireDistance(fireResult.monthsToFire);
  const childCount = household.children.length;
  const nearestChild = household.children
    .map((child) => ({ child, years: Math.max(0, child.independenceAge - child.age) }))
    .sort((a, b) => a.years - b.years)[0];

  const summary =
    savingsRate >= 40
      ? `이번 달 저축률 ${savingsRate}%로 크루 ${me?.rank ?? '-'}위, FIRE까지 ${fireDistance} 코스가 안정적으로 굴러가고 있어요.`
      : `이번 달 저축률 ${savingsRate}%, 1위 ${leader?.name}와 ${Math.max(0, (leader?.savingsRate ?? 0) - savingsRate)}%p 차이. 지출 라인만 손보면 다시 가속해요.`;

  const risks: AiReportRiskItem[] = [];
  if (nearestChild) {
    risks.push({
      title: '교육비 피크 구간 진입',
      body: `${nearestChild.child.name} 독립까지 ${nearestChild.years}년. 교육비 버퍼를 별도 계좌로 분리해두면 저축률 변동을 줄일 수 있어요.`,
    });
  } else {
    risks.push({
      title: '고정지출 비중 점검',
      body: `현재 고정지출 비율이 높아요. 구독·통신비를 분기 1회 정리하면 월 ${Math.max(5, Math.round(savingsRate / 10))}만원 수준 여유가 생깁니다.`,
    });
  }
  risks.push({
    title: '비상자금 6개월치 확보',
    body: `월지출의 6배 = ${Math.round((fireResult.monthlyExpense * 6) / 10_000).toLocaleString('ko-KR')}만원. 단기 예금/MMF에 분리해두면 시장 충격에서 FIRE 일정이 흔들리지 않아요.`,
  });

  const strategies: AiReportStrategyItem[] = [
    {
      title: `자동이체 +${Math.max(10, Math.round(fireResult.monthlySavings * 0.05 / 10_000))}만원`,
      body: '월급일 다음날로 고정. 저축률을 먼저 잠그고 남은 돈으로 생활하는 구조가 가장 안전합니다.',
      impactMonths: 2,
    },
    {
      title: '공동지출 주 1회 점검',
      body: childCount > 0 ? '부부 + 자녀 공용지출은 매주 일요일 10분만 봐도 새는 비용이 보여요.' : '구독·외식 카테고리 두 개만 따로 추적해도 효과가 큽니다.',
      impactMonths: 1,
    },
    {
      title: '단축 개월 트래킹',
      body: `이번 달 ${fireResult.savedMonthsThisMonth}개월 단축 페이스를 6개월 누적으로 보면 동기 유지가 훨씬 쉬워져요.`,
    },
  ];

  const localTips =
    household.members.length > 1
      ? '부부라면 ISA·IRP·연금저축을 한 사람에게 몰지 말고 각자 한도(연 1,800만원)대로 나눠 쓰세요. 연말정산 환급액이 평균 30~50만원 차이 납니다.'
      : 'ISA 비과세 한도(서민형 400만원)와 연금저축 세액공제(연 600만원)를 같이 챙기면 실효 수익률이 1.5~2%p 올라갑니다.';

  return { summary, risks, strategies, localTips };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function checkAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw abortError();
  }
}

function abortError() {
  const err = new Error('aborted');
  err.name = 'AbortError';
  return err;
}
