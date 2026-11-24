import Image, { type StaticImageData } from "next/image";
import LocalizedImage from "@/components/LocalizedImage";

// Prepared 1200 × 900 WebP covers for the event index. Custom CMS uploads
// keep their own URL, and event details always display the original artwork.
const cardCovers: Record<string, string> = {
  "/events/her-leadership-dna-2027-cover.webp": "her-leadership-dna-2027-cover",
  "/events/executive-series-2026-12-11.jpg": "executive-series-2026-12-11",
  "/events/executive-series-2026-09-18.jpg": "executive-series-2026-09-18",
  "/events/executive-series-11-june-2026.jpg": "executive-series-11-june-2026",
  "/events/mike-jackson-1.jpg": "mike-jackson-1",
  "/events/nitin/chro-nexus.jpg": "chro-nexus",
  "/events/nitin/marcus-evans.jpg": "marcus-evans",
  "/events/nitin/economic-times-singapore.jpg": "economic-times-singapore",
  "/events/nitin/economic-times-philippines.jpg": "economic-times-philippines",
  "/events/nitin/hr-tech.jpg": "hr-tech",
};

export default function EventVisual({ image, alt, sizes, contain = false, card = false }: {
  image?: string | StaticImageData;
  alt: string;
  sizes: string;
  contain?: boolean;
  card?: boolean;
}) {
  if (!image) {
    return (
      <div className="absolute inset-0 bg-brand">
        <div className="absolute inset-[20%]">
          <Image src="/events/cdna-white-logo.png" alt="CorporateDNA Consulting" fill sizes={sizes} className="object-contain" />
        </div>
      </div>
    );
  }
  const cover = card && typeof image === "string" ? cardCovers[image] : undefined;
  const src = cover ? `/events/cards/${cover}.webp` : image;
  if (image === "/events/executive-series-2026-12-11.jpg") {
    const ptSrc = card ? "/events/cards/executive-series-2026-12-11-pt-br.webp" : "/events/executive-series-2026-12-11-pt-br.webp";
    return <LocalizedImage src={src} ptSrc={ptSrc} alt={alt} ptAlt="Convite para a Série Executiva CDNA sobre liderança e cultura" fill sizes={sizes} className={contain ? "object-contain" : "object-cover"} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} className={contain ? "object-contain" : "object-cover"} />;
}
