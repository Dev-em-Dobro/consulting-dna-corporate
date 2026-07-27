import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import CookieConsent from "@/components/CookieConsent";
import TopProgress from "@/components/TopProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { organizationLd } from "@/lib/seo/jsonld";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_TITLE = "Corporate DNA — Making Leadership Real";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/cdna-logo-horizontal.svg", type: "image/svg+xml" }],
    apple: [{ url: "/cdna-logo.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#d84339",
};

// Single-locale (English) shell. next-intl runs without i18n routing, so there is
// no `[locale]` segment and no middleware — the locale is fixed in lib/i18n/request.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
        <JsonLd data={organizationLd()} />
        <NextIntlClientProvider>
          <TopProgress />
          {children}
          <WhatsAppButton />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
