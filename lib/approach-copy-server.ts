import 'server-only';
import { DEFAULT_APPROACH_COPY } from '@/lib/approach-copy';
import { ApproachCopySchema } from '@/lib/approach-copy-schema';
import { createCopyStore } from '@/lib/page-copy/store';

export const approachCopyStore = createCopyStore({
  key: 'approach', defaults: DEFAULT_APPROACH_COPY, schema: ApproachCopySchema, mergeArrayObjects: true,
});
export const getApproachCopy = approachCopyStore.read;
