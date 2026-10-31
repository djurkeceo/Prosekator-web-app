import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ServiceWorkerRegister } from "@/components/providers/service-worker-register";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { APP_DESCRIPTION, APP_NAME, SITE_URL } from "@/lib/constants";
import { getSessionUser } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prosekator — Kalkulator proseka i praćenje ocena",
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: APP_NAME, url: SITE_URL }],
  creator: APP_NAME,
  keywords: [
    "prosekator",
    "kalkulator proseka",
    "računanje proseka",
    "školski prosek",
    "ocene",
    "praćenje ocena",
    "akademski uspeh",
    "škola",
    "učenici",
    "studenti",
    "Srbija",
  ],
  category: "education",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: "/",
    siteName: APP_NAME,
    title: "Prosekator — Tvoj prosek. Tvoja kontrola.",
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prosekator — kalkulator školskog proseka i praćenje ocena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prosekator — Kalkulator proseka",
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "xQzspotndlaTs76hPKwO0EMpkMFI84a_UCA25aHae5E",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7ec" },
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem("prosekator-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme="dark";document.documentElement.style.colorScheme="dark";}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "RSD",
  },
  inLanguage: "sr",
  featureList:
    "Praćenje ocena, Računanje proseka, Statistika po predmetima, Simulator ciljnog proseka, Gost režim, PWA",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <html lang="sr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <AuthProvider initialUser={user}>
            <ToastProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-accent-fg"
              >
                Preskoči na sadržaj
              </a>
              <SiteHeader />
              {children}
              <SiteFooter />
              <ServiceWorkerRegister />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
