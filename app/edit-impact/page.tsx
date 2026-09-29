import type { Metadata } from 'next';
import CopyEditor from '@/components/copy-editor/CopyEditor';
import { DEFAULT_IMPACT_COPY, EDITOR_SECTIONS } from '@/lib/impact-copy';
import { getImpactCopy } from '@/lib/impact-copy-server';

export const metadata: Metadata = {
  title: 'Edit Impact page text | Corporate DNA', robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function EditImpactPage() {
  const copy = await getImpactCopy();
  return <CopyEditor initial={copy} defaults={DEFAULT_IMPACT_COPY} sections={EDITOR_SECTIONS}
    apiPath='/api/impact-copy' siteHref='/our-impact' title='Impact page text'
    note="This editor changes Our Impact. Photos and the map stay in code; Clients has a separate editor." />;
}
