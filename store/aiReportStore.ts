import { create } from 'zustand';

import {
  activeProvider,
  AiReport,
  AiReportInput,
  AiReportProvider,
  AiReportStreamError,
  getAiReportStreamer,
  PartialAiReport,
} from '@/lib/aiReport';
import { getLocalAiReport, saveLocalAiReport } from '@/lib/localFinanceStorage';

export type AiReportStatus = 'idle' | 'streaming' | 'done' | 'error';

type AiReportState = {
  status: AiReportStatus;
  provider: AiReportProvider;
  report: AiReport | null;
  partial: PartialAiReport | null;
  error: { code: string; message: string } | null;
  hasHydrated: boolean;
};

type AiReportActions = {
  hydrate: () => Promise<void>;
  generate: (input: AiReportInput) => Promise<void>;
  cancel: () => void;
  clearError: () => void;
};

const abortController = { current: null as AbortController | null };

export const useAiReportStore = create<AiReportState & AiReportActions>((set, get) => ({
  status: 'idle',
  provider: activeProvider,
  report: null,
  partial: null,
  error: null,
  hasHydrated: false,
  hydrate: async () => {
    if (get().hasHydrated) return;
    const cached = await getLocalAiReport();
    if (cached) {
      set({ report: cached, status: 'done', hasHydrated: true });
    } else {
      set({ hasHydrated: true });
    }
  },
  generate: async (input) => {
    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;

    set({ status: 'streaming', partial: null, error: null });

    try {
      const streamer = getAiReportStreamer();
      for await (const event of streamer.stream(input, controller.signal)) {
        if (controller.signal.aborted) return;
        if (event.type === 'partial') {
          set({ partial: event.report });
        } else if (event.type === 'done') {
          set({ report: event.report, partial: null, status: 'done' });
          await saveLocalAiReport(event.report);
        } else if (event.type === 'error') {
          throw event.error;
        }
      }
    } catch (err) {
      if (controller.signal.aborted || (err as Error)?.name === 'AbortError') {
        set({ status: get().report ? 'done' : 'idle', partial: null });
        return;
      }
      const error =
        err instanceof AiReportStreamError
          ? { code: err.code, message: err.message }
          : { code: 'unknown', message: (err as Error)?.message ?? '리포트를 만들지 못했어요.' };
      set({ status: 'error', partial: null, error });
    } finally {
      if (abortController.current === controller) {
        abortController.current = null;
      }
    }
  },
  cancel: () => {
    abortController.current?.abort();
  },
  clearError: () => set({ error: null }),
}));
