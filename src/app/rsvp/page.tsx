import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { RsvpFlow } from "@/components/rsvp/rsvp-flow";

export const metadata: Metadata = {
  title: "RSVP",
  description: "Find your invitation and let us know if you can make it.",
};

export default function RsvpPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero title="RSVP" eyebrow="Kindly reply" compact />
      <div className="section section--tight">
        <div className="panel rsvp-card">
          <RsvpFlow />
        </div>
      </div>
    </main>
  );
}
