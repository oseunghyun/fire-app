import { AiReportStreamer, AiReportStreamError, AiReportStreamEvent } from './streamer';
import type { AiReportInput } from './schema';

/**
 * Real Claude streamer — Phase 2 (결제 후 활성화).
 * Supabase Edge Function `ai-report` 가 Anthropic SSE 응답을 패스스루하는 구조.
 *
 * 활성화 절차:
 *   1. Supabase Edge Function 배포 (supabase/functions/ai-report)
 *   2. ANTHROPIC_API_KEY 시크릿 등록
 *   3. EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL 환경변수 설정
 *   4. EXPO_PUBLIC_AI_REPORT_PROVIDER=claude 로 전환
 */
export const claudeStreamer: AiReportStreamer = {
  async *stream(input: AiReportInput, signal?: AbortSignal): AsyncIterable<AiReportStreamEvent> {
    void input;
    void signal;
    throw new AiReportStreamError(
      'not_configured',
      'Claude AI 리포트는 아직 활성화되지 않았어요. 결제 + Edge Function 배포 후 사용할 수 있어요.',
    );
    // eslint-disable-next-line no-unreachable
    yield { type: 'error', error: new AiReportStreamError('not_configured', '') };
  },
};
