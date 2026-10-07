import type { Metadata, Viewport } from "next";
import { Cinzel, Great_Vibes, Montserrat } from "next/font/google";
import { BackToTop } from "@/components/back-to-top";
import { InlineScript } from "@/components/inline-script";
import { SiteHeader } from "@/components/site-header";
import { ENTERED_KEY } from "@/lib/splash";
import { wedding } from "@/content/wedding";
import "./globals.css";

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

const display = Cinzel({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Montserrat({
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:4317"),
  title: {
    default: `${wedding.couple} · ${wedding.dateLabel}`,
    template: `%s · ${wedding.couple}`,
  },
  description: `Join ${wedding.couple} on ${wedding.dateLabel} at ${wedding.venue}. Details, RSVP, places to stay, and our registry.`,
  icons: { icon: "/images/logo.png" },
  openGraph: {
    title: `${wedding.couple} · ${wedding.dateLabel}`,
    description: `We're getting married at ${wedding.venueShort}. RSVP, details, and travel info inside.`,
    images: ["/images/background.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1f2219",
};

// The home splash plays once per browser session. Arriving on any other page
// counts as having entered, so returning home doesn't replay it.
const enteredScript = `try{var k=${JSON.stringify(ENTERED_KEY)};if(location.pathname!=="/"||sessionStorage.getItem(k)){document.documentElement.dataset.entered="seen";sessionStorage.setItem(k,"1")}}catch(e){document.documentElement.dataset.entered="seen"}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${script.variable} ${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>
        <InlineScript html={enteredScript} />
        <noscript>
          <style>{`.reveal-gate,.masthead{opacity:1!important;transform:none!important}.splash{display:none!important}body{overflow:auto!important}`}</style>
        </noscript>
        <div className="background-image" aria-hidden="true" />
        <div className="background-overlay" aria-hidden="true" />
        <SiteHeader />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
