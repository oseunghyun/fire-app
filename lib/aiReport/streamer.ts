import type { AiReport, AiReportInput, PartialAiReport } from './schema';

export type AiReportStreamEvent =
  | { type: 'partial'; report: PartialAiReport }
  | { type: 'done'; report: AiReport }
  | { type: 'error'; error: AiReportStreamError };

export class AiReportStreamError extends Error {
  code: 'not_configured' | 'network' | 'aborted' | 'invalid_response' | 'unknown';

  constructor(code: AiReportStreamError['code'], message: string) {
    super(message);
    this.code = code;
    this.name = 'AiReportStreamError';
  }
}

export type AiReportStreamer = {
  stream(input: AiReportInput, signal?: AbortSignal): AsyncIterable<AiReportStreamEvent>;
};

export type AiReportProvider = 'mock' | 'claude';
