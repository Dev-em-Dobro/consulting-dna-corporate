"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

type Props = ImageProps & { ptSrc: ImageProps["src"]; ptAlt: string };

/** Choose the translated artwork without changing the existing page URL. */
export default function LocalizedImage({ ptSrc, ptAlt, src, alt, ...props }: Props) {
  const [portuguese, setPortuguese] = useState(false);

  useEffect(() => {
    setPortuguese(document.cookie.match(/(?:^|;\s*)site_locale=([^;]+)/)?.[1] === "pt-BR");
  }, []);

  return <Image {...props} src={portuguese ? ptSrc : src} alt={portuguese ? ptAlt : alt} />;
}
