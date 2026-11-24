import 'server-only';
import { DEFAULT_APPROACH_COPY, type ApproachCopy } from '@/lib/approach-copy';
import { ApproachCopySchema } from '@/lib/approach-copy-schema';
import { createCopyStore } from '@/lib/page-copy/store';

export const approachCopyStore = createCopyStore({
  key: 'approach', defaults: DEFAULT_APPROACH_COPY, schema: ApproachCopySchema, mergeArrayObjects: true,
  migrationVersion: '2026-11-24-profiler',
  migrateSaved(saved) {
    if (!saved || typeof saved !== 'object') return saved;
    const copy = structuredClone(saved) as Partial<ApproachCopy>;
    const fact = copy.profiler?.facts?.[1];
    if (typeof fact?.value === 'string' && /^ph\.?d[. -]*led$/i.test(fact.value.trim())) {
      copy.profiler!.facts[1] = { ...DEFAULT_APPROACH_COPY.profiler.facts[1] };
    }
    if ((saved as Record<string, unknown>).__copyRevision === '2026-09-29-doc-corrections') return copy;
    if (copy.hero?.title && /five intelligences/i.test(copy.hero.title)) copy.hero.title = DEFAULT_APPROACH_COPY.hero.title;
    if (copy.hero?.subtitle && /neuroscience/i.test(copy.hero.subtitle)) copy.hero.subtitle = DEFAULT_APPROACH_COPY.hero.subtitle;
    if (copy.fiveH?.heading === 'Five intelligences. One whole leader.') copy.fiveH.heading = DEFAULT_APPROACH_COPY.fiveH.heading;
    return copy;
  },
});
export const getApproachCopy = approachCopyStore.read;
