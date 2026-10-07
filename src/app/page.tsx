import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/home/countdown";
import { Polaroids } from "@/components/home/polaroids";
import { Splash } from "@/components/home/splash";
import { StayTile } from "@/components/stay-tile";
import { featuredFaqs } from "@/content/faq";
import { stays } from "@/content/stays";
import { wedding } from "@/content/wedding";

const quickFacts = [
  {
    title: "Venue",
    body: "Waldenwoods Resort — ceremony, cocktails, and reception on site with complimentary parking.",
  },
  {
    title: "Ceremony",
    body: "Outdoor lawn by the lake (weather backup available). Semi-formal attire, please.",
  },
  {
    title: "Reception",
    body: "Ballroom dinner, toasts, and dancing. Shuttle runs between lodge and ballroom.",
  },
  {
    title: "Menu",
    body: "Classic selections with vegetarian options; please note dietary needs on the RSVP.",
  },
];

const keyNotes = ["Free on-site parking", "Cocktail hour", "Semi-formal attire", "Lakeside photos"];
const milestones = ["How we met", "First date", "The “yes” moment"];

function Chips({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="chips" aria-label={label}>
      {items.map((item) => (
        <li className="chip" key={item}>
          <span className="dot" aria-hidden="true" /> {item}
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  return (
    <>
      <Splash />

      <main id="main" tabIndex={-1}>
        <section className="home-header reveal-gate" aria-label="Welcome">
          <h1>{wedding.couple}</h1>
          <p>
            {wedding.dateLabel} <span aria-hidden="true">&nbsp;•&nbsp;</span>
            <span className="sr-only">at</span> {wedding.venue}
          </p>
        </section>

        <section
          className="countdown-band reveal-gate"
          aria-label="Countdown to our wedding"
          style={{ "--delay": "120ms" } as React.CSSProperties}
        >
          <Countdown target={wedding.startsAt} />
        </section>

        <div className="rsvp-cta reveal-gate" style={{ "--delay": "200ms" } as React.CSSProperties}>
          <Link className="btn btn-outline btn--white" href="/rsvp">
            Click to RSVP Here
          </Link>
        </div>

        <section
          className="details-section reveal-gate"
          aria-labelledby="details-title"
          style={{ "--delay": "320ms" } as React.CSSProperties}
        >
          <div className="summary-inner">
            <div className="summary-head">
              <p className="eyebrow">At a glance</p>
              <h2 className="section-title" id="details-title">
                The Details
              </h2>
            </div>

            <div className="summary-intro">
              <Image
                className="summary-photo"
                src="/images/waldenwoods.jpg"
                alt="Waldenwoods banquet pavilion with its gold crest"
                width={757}
                height={238}
                sizes="(max-width: 820px) 92vw, 757px"
              />
              <p className="summary-body">
                Join us at <strong>{wedding.venueShort}</strong> for a lakeside celebration.
                We&rsquo;ll host the <em>ceremony</em> outdoors (weather permitting), followed by a
                relaxed <em>cocktail hour</em> on the grounds, and an elegant <em>reception</em> in
                the ballroom. We&rsquo;ll close the evening with a sweet <em>exit</em> you
                won&rsquo;t want to miss. See the full menu and timing on the details page.
              </p>
            </div>

            <div className="quick-grid">
              {quickFacts.map((fact) => (
                <div className="quick-item" key={fact.title}>
                  <h3>{fact.title}</h3>
                  <p>{fact.body}</p>
                </div>
              ))}
            </div>

            <Chips items={keyNotes} label="Key notes" />

            <div className="summary-actions">
              <Link className="btn btn-outline" href="/details">
                View Details
              </Link>
            </div>
          </div>
        </section>

        <section
          className="card-section reveal-gate"
          aria-labelledby="story-title"
          style={{ "--delay": "360ms" } as React.CSSProperties}
        >
          <div className="card story-inner">
            <div>
              <p className="eyebrow">A little about us</p>
              <h2 className="section-title" id="story-title">
                Our Story
              </h2>
              <div className="story-body">
                <p>
                  From a chance hello to a lifetime of inside jokes—this is our favorite tale.
                  We&rsquo;ve gathered the milestones, the winding paths, and the tiny moments that
                  made everything click. If you&rsquo;d like the long version, we&rsquo;d love to
                  share it.
                </p>
                <Chips items={milestones} label="Milestones" />
                <div className="story-actions">
                  <Link className="btn btn-outline" href="/our-story">
                    Read the full story
                  </Link>
                </div>
              </div>
            </div>
            <Polaroids />
          </div>
        </section>

        <section
          className="stays-section reveal-gate"
          aria-labelledby="stays-title"
          style={{ "--delay": "400ms" } as React.CSSProperties}
        >
          <div className="stays-head">
            <p className="eyebrow eyebrow--light">Nearby hotels</p>
            <h2 className="section-title" id="stays-title">
              Places to Stay
            </h2>
          </div>
          <ul className="stays-rail">
            {stays.map((stay) => (
              <li key={stay.id}>
                <StayTile stay={stay} />
              </li>
            ))}
          </ul>
          <div className="stays-cta">
            <Link className="btn btn-outline btn--white" href="/places-to-stay">
              See all lodging options
            </Link>
          </div>
        </section>

        <section
          className="card-section reveal-gate"
          aria-labelledby="registry-title"
          style={{ "--delay": "420ms" } as React.CSSProperties}
        >
          <div className="card registry-inner">
            <div>
              <p className="eyebrow">Gifts</p>
              <h2 className="section-title section-title--sm" id="registry-title">
                Registry
              </h2>
              <p className="registry-text">
                Your presence means the world to us. If you&rsquo;d like to give a gift, we have a{" "}
                <em>Trip Fund</em> and a traditional <em>Registry</em> — we appreciate either one.
              </p>
            </div>
            <Link className="btn btn-outline" href="/registry">
              Visit Registry
            </Link>
          </div>
        </section>

        <section
          className="card-section faq-section reveal-gate"
          aria-labelledby="faq-title"
          style={{ "--delay": "460ms" } as React.CSSProperties}
        >
          <div className="card faq-inner">
            <div className="faq-head">
              <div>
                <p className="eyebrow">Good to know</p>
                <h2 className="section-title" id="faq-title">
                  FAQ
                </h2>
              </div>
              <Link className="btn btn-outline" href="/faq">
                View All FAQs
              </Link>
            </div>
            <div className="faq-list">
              {featuredFaqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p className="answer">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
