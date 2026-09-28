import type { Metadata } from 'next';
import CopyEditor from '@/components/copy-editor/CopyEditor';
import { DEFAULT_INSIGHTS_COPY, EDITOR_SECTIONS } from '@/lib/insights-copy';
import { getInsightsCopy } from '@/lib/insights-copy-server';

export const metadata: Metadata = {
  title: 'Edit Insights page text | Corporate DNA', robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function EditInsightsPage() {
  const copy = await getInsightsCopy();
  return <CopyEditor initial={copy} defaults={DEFAULT_INSIGHTS_COPY} sections={EDITOR_SECTIONS}
    apiPath='/api/insights-copy' siteHref='/insights' title='Insights page text'
    note="Edit the page and PDF resource text here. Articles and authors are managed in the CMS." />;
}
