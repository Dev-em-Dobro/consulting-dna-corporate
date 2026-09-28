import { impactCopyStore } from '@/lib/impact-copy-server';
import { createCopyRoute } from '@/lib/page-copy/route';

export const dynamic = 'force-dynamic';
export const { GET, POST } = createCopyRoute({
  key: 'impact', store: impactCopyStore, revalidate: ['/our-impact'],
});
