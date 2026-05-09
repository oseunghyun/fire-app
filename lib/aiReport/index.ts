import { claudeStreamer } from './claudeStreamer';
import { mockStreamer } from './mockStreamer';
import type { AiReportProvider, AiReportStreamer } from './streamer';

export * from './schema';
export * from './streamer';

const envProvider = (process.env.EXPO_PUBLIC_AI_REPORT_PROVIDER ?? '').toLowerCase();

export const activeProvider: AiReportProvider = envProvider === 'claude' ? 'claude' : 'mock';

export const isMockProvider = activeProvider === 'mock';

export function getAiReportStreamer(): AiReportStreamer {
  return activeProvider === 'claude' ? claudeStreamer : mockStreamer;
}
