import type { Metadata } from 'next';
import CopyEditor from '@/components/copy-editor/CopyEditor';
import { DEFAULT_APPROACH_COPY, EDITOR_SECTIONS } from '@/lib/approach-copy';
import { getApproachCopy } from '@/lib/approach-copy-server';

export const metadata: Metadata = {
  title: 'Edit Approach page text | Corporate DNA', robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function EditApproachPage() {
  const copy = await getApproachCopy();
  return <CopyEditor initial={copy} defaults={DEFAULT_APPROACH_COPY} sections={EDITOR_SECTIONS}
    apiPath='/api/approach-copy' siteHref='/approach' title='Approach page text'
    note="Edit the 5H content, profiler and FAQs. Diagram artwork and images remain unchanged." />;
}
