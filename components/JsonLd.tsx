/**
 * Renders a JSON-LD structured-data block. Server component — the script is in
 * the initial HTML, so crawlers and the Rich Results Test see it without JS.
 * Pass a single schema object or an array of them.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
