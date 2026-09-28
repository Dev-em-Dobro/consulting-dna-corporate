import Image, { type StaticImageData } from "next/image";

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
  return <Image src={image} alt={alt} fill sizes={sizes} className={contain ? "object-contain" : "object-cover"} />;
}
