/**
 * Geocode "city, country" to coordinates via OpenStreetMap Nominatim (free, no
 * API key). The result is cached for 30 days — a city's location never changes,
 * so the lookup runs at most once per city per cache window (keeping us well
 * within Nominatim's fair-use policy, alongside a descriptive User-Agent).
 * Returns null on a miss or error so callers degrade gracefully: the country
 * still paints, the pin is simply skipped.
 */
export async function geocode(
  city?: string | null,
  country?: string | null,
): Promise<{ lat: number; lng: number } | null> {
  const q = [city, country].filter(Boolean).join(", ").trim();
  if (!q) return null;

  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(q);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "CorporateDNA-CoverageMap/1.0 (+https://corporatednaconsulting.com)",
      },
      next: { revalidate: 60 * 60 * 24 * 30, tags: ["geocode"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { lat: string; lon: string }[];
    if (!data.length) return null;
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}
