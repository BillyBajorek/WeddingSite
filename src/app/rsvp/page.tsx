import type { Metadata } from "next";
import { RsvpFlow } from "@/components/rsvp/rsvp-flow";

export const metadata: Metadata = {
  title: "RSVP",
  description: "Find your invitation and let us know if you can make it.",
};

export default function RsvpPage() {
  return (
    <main id="main" className="rsvp-page" tabIndex={-1}>
      <div className="card rsvp-card">
        <h1 className="section-title rsvp-title">RSVP</h1>
        <RsvpFlow />
      </div>
    </main>
  );
}
