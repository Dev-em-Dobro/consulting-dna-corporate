import Image, { type StaticImageData } from "next/image";
import LocalizedImage from "@/components/LocalizedImage";

export default function EventVisual({ image, alt, sizes, contain = false }: {
  image?: string | StaticImageData;
  alt: string;
  sizes: string;
  contain?: boolean;
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
  if (image === "/events/executive-series-2026-12-11.jpg") {
    return <LocalizedImage src={image} ptSrc="/events/executive-series-2026-12-11-pt-br.webp" alt={alt} ptAlt="Convite para a Série Executiva CDNA sobre liderança e cultura" fill sizes={sizes} className={contain ? "object-contain" : "object-cover"} />;
  }
  return <Image src={image} alt={alt} fill sizes={sizes} className={contain ? "object-contain" : "object-cover"} />;
}
