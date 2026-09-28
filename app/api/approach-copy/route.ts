import { approachCopyStore } from '@/lib/approach-copy-server';
import { createCopyRoute } from '@/lib/page-copy/route';

export const dynamic = 'force-dynamic';
export const { GET, POST } = createCopyRoute({
  key: 'approach', store: approachCopyStore, revalidate: ['/approach'],
});
