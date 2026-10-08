import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Inter } from "next/font/google";
import { BackToTop } from "@/components/back-to-top";
import { InlineScript } from "@/components/inline-script";
import { RevealObserver } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ENTERED_KEY } from "@/lib/splash";
import { wedding } from "@/content/wedding";
import "./globals.css";

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

const serif = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:4317"),
  title: {
    default: `${wedding.couple} · ${wedding.dateLabel}`,
    template: `%s · ${wedding.couple}`,
  },
  description: `Join ${wedding.couple} on ${wedding.dateLabel} at ${wedding.venue}. Details, RSVP, places to stay, and our registry.`,
  openGraph: {
    title: `${wedding.couple} · ${wedding.dateLabel}`,
    description: `We're getting married at ${wedding.venueShort}. RSVP, details, and travel info inside.`,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f1",
};

// The home intro plays once per browser session. Arriving on any other page
// counts as having seen it, so returning home doesn't replay it.
const enteredScript = `try{var d=document.documentElement,k=${JSON.stringify(ENTERED_KEY)};d.dataset.js="";if(location.pathname!=="/"||sessionStorage.getItem(k)){d.dataset.entered="seen";sessionStorage.setItem(k,"1")}}catch(e){document.documentElement.dataset.entered="seen"}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${script.variable} ${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <InlineScript html={enteredScript} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <BackToTop />
        <RevealObserver />
      </body>
    </html>
  );
}
