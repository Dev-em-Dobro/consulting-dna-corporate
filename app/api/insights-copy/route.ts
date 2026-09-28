import { insightsCopyStore } from '@/lib/insights-copy-server';
import { createCopyRoute } from '@/lib/page-copy/route';

export const dynamic = 'force-dynamic';
export const { GET, POST } = createCopyRoute({
  key: 'insights', store: insightsCopyStore, revalidate: ['/insights'],
});
