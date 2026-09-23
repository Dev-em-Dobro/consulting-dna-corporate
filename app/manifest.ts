import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

// Web app manifest (Next.js metadata convention → <link rel="manifest">).
// SVG icon for now; add 192/512 PNG maskable icons when raster assets exist.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "CorporateDNA",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d84339",
    icons: [
      { src: "/cdna-logo.svg", type: "image/svg+xml", sizes: "any" },
    ],
  };
}
