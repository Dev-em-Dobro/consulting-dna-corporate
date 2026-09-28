import 'server-only';
import { DEFAULT_IMPACT_COPY } from '@/lib/impact-copy';
import { ImpactCopySchema } from '@/lib/impact-copy-schema';
import { createCopyStore } from '@/lib/page-copy/store';

export const impactCopyStore = createCopyStore({
  key: 'impact', defaults: DEFAULT_IMPACT_COPY, schema: ImpactCopySchema, mergeArrayObjects: true,
});
export const getImpactCopy = impactCopyStore.read;
