import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { navItems } from "@/content/wedding";

// Stand-in for pages still being moved over from Webflow. A real folder such as
// app/details/ takes precedence over this route automatically.
const pages = Object.fromEntries(navItems.map((item) => [item.href.slice(1), item.label]));

export const instant = false;

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: pages[slug] };
}

export default async function ComingSoonPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const label = pages[slug];
  if (!label) notFound();

  return (
    <main id="main" className="page-intro">
      <div className="card">
        <p className="eyebrow">Coming soon</p>
        <h1 className="section-title">{label}</h1>
        <p>
          We&rsquo;re putting the finishing touches on this page. Check back soon — in the
          meantime, everything you need for the big day is on the home page.
        </p>
        <Link className="btn btn-outline" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
