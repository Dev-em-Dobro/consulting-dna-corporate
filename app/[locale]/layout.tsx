import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import "../globals.css";
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={poppins.variable}>
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
