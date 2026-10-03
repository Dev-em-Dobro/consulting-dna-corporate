import 'server-only';
import { DEFAULT_INSIGHTS_COPY, type InsightsCopy } from '@/lib/insights-copy';
import { InsightsCopySchema } from '@/lib/insights-copy-schema';
import { createCopyStore } from '@/lib/page-copy/store';

/** Títulos de herói já substituídos pelo padrão: o salvo que ainda os tiver é migrado. */
const OLD_HERO_TITLES = ["Let’s share some insights.", "Let's share some insights.", "Let’s share some insights", "Let's share some insights"];
/* O título que estava salvo no editor ("What we’re seeing / What we’re
   curating") também sai: a troca foi decidida com a cliente na call de 01-10. */
const OLD_HERO_TITLE_RE = /^What we[’']re seeing\s+What we[’']re curating\.?$/i;

export const insightsCopyStore = createCopyStore({
  key: 'insights', defaults: DEFAULT_INSIGHTS_COPY, schema: InsightsCopySchema, mergeArrayObjects: true,
  /* 01-10: o herói passou a "Insights for the moments that shape leadership".
     Só troca o título se ele ainda for o antigo  -  um título que a cliente
     tenha reescrito no editor fica como ela deixou. */
  migrationVersion: '2026-10-01-hero-title-2',
  migrateSaved(saved) {
    if (!saved || typeof saved !== 'object') return saved;
    const copy = structuredClone(saved) as Partial<InsightsCopy>;
    if (copy.hero && (OLD_HERO_TITLES.includes(copy.hero.title?.trim()) || OLD_HERO_TITLE_RE.test(copy.hero.title?.trim() ?? ''))) {
      copy.hero.title = DEFAULT_INSIGHTS_COPY.hero.title;
    }
    return copy;
  },
});
export const getInsightsCopy = insightsCopyStore.read;
