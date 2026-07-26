import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

// File-based OG image (Next.js metadata convention). Applies to every route
// under /[locale] and auto-populates BOTH og:image and twitter:image, so a
// branded 1200×630 card is shared to LinkedIn, WhatsApp, X, etc. Detail pages
// override this with their CMS cover via `openGraph.images` in generateMetadata.
export const alt = "Corporate DNA — Global Leadership Advisory & Executive Coaching";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (mirrors app/globals.css --color-brand / --color-ink).
const BRAND = "#d84339";
const INK = "#373234";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "56px", height: "6px", background: BRAND }} />
          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            maxWidth: "900px",
          }}
        >
          Global leadership advisory &amp; executive coaching.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "30px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          Making leadership real — across 36 countries.
        </div>
      </div>
    ),
    { ...size },
  );
}
