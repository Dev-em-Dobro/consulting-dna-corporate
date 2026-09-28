import 'server-only';
import { DEFAULT_INSIGHTS_COPY } from '@/lib/insights-copy';
import { InsightsCopySchema } from '@/lib/insights-copy-schema';
import { createCopyStore } from '@/lib/page-copy/store';

export const insightsCopyStore = createCopyStore({
  key: 'insights', defaults: DEFAULT_INSIGHTS_COPY, schema: InsightsCopySchema, mergeArrayObjects: true,
});
export const getInsightsCopy = insightsCopyStore.read;
