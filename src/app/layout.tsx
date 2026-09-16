import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

function safeMetadataBase(url: string): URL {
  try {
    return new URL(url);
  } catch {
    // Never let a malformed SITE_URL (e.g. a blank env var on the
    // hosting platform) crash the entire production build.
    return new URL("https://kemetfoundationinc.vercel.app");
  }
}

export const metadata: Metadata = {
  metadataBase: safeMetadataBase(SITE_URL),
  title: {
    default: `${SITE_NAME} | Building Community. Preserving Legacy.`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Kemet Foundation Inc is a Florida nonprofit dedicated to African heritage and cultural education, community development, family strengthening, economic empowerment, and collective advancement.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Building Community. Preserving Legacy.`,
    description:
      "A Florida nonprofit dedicated to African heritage, community development, education, and economic empowerment.",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE_NAME,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    postOfficeBoxNumber: "2284",
    addressLocality: "Jacksonville",
    addressRegion: "FL",
    postalCode: "32208",
    addressCountry: "US",
  },
  areaServed: "US-FL",
  description:
    "A Florida nonprofit dedicated to African heritage and cultural education, community development, family strengthening, economic empowerment, and collective advancement.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
