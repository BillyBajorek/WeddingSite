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

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

export default function HomePage() {
  return (
    <>
      <Splash />

      <main id="main" tabIndex={-1}>
        <section className="hero" aria-label="Welcome">
          <Image
            className="hero-photo"
            src="/images/background.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-content">
            <p className="hero-kicker hero-reveal" style={delay(0)}>
              We&rsquo;re getting married
            </p>
            <h1 className="hero-names hero-reveal" style={delay(120)}>
              {wedding.couple}
            </h1>
            <p className="hero-when hero-reveal" style={delay(240)}>
              {wedding.dateLabel}
              <span className="hero-sep" aria-hidden="true" />
              <span className="sr-only">at</span> {wedding.venueShort}, Howell, Michigan
            </p>
            <div className="hero-reveal" style={delay(360)}>
              <Countdown target={wedding.startsAt} />
            </div>
            <div className="hero-actions hero-reveal" style={delay(480)}>
              <Link className="btn btn-primary btn--light" href="/rsvp">
                RSVP
              </Link>
              <Link className="btn btn-outline btn--white" href="/details">
                The details
              </Link>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="details-title">
          <div className="container">
            <div className="split" data-reveal>
              <Image
                className="split-photo"
                src="/images/waldenwoods.jpg"
                alt="Waldenwoods banquet pavilion with its gold crest"
                width={757}
                height={238}
                sizes="(max-width: 900px) 92vw, 560px"
              />
              <div>
                <p className="eyebrow">At a glance</p>
                <h2 className="section-title" id="details-title">
                  The Details
                </h2>
                <p className="prose">
                  Join us at <strong>{wedding.venueShort}</strong> for a lakeside celebration.
                  We&rsquo;ll host the ceremony outdoors (weather permitting), followed by a relaxed
                  cocktail hour on the grounds and an elegant reception in the ballroom. We&rsquo;ll
                  close the evening with a sweet exit you won&rsquo;t want to miss.
                </p>
                <Link className="btn btn-outline" href="/details">
                  Full schedule &amp; menu
                </Link>
              </div>
            </div>

            <dl className="facts" data-reveal style={delay(100)}>
              {quickFacts.map((fact) => (
                <div key={fact.title}>
                  <dt>{fact.title}</dt>
                  <dd>{fact.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section section--stone" aria-labelledby="story-title">
          <div className="container split split--story">
            <div data-reveal>
              <p className="eyebrow">A little about us</p>
              <h2 className="section-title" id="story-title">
                Our Story
              </h2>
              <p className="prose">
                From a chance hello to a lifetime of inside jokes—this is our favorite tale.
                We&rsquo;ve gathered the milestones, the winding paths, and the tiny moments that
                made everything click. If you&rsquo;d like the long version, we&rsquo;d love to share
                it.
              </p>
              <Link className="btn btn-outline" href="/our-story">
                Read our story
              </Link>
            </div>
            <div data-reveal style={delay(120)}>
              <Polaroids />
            </div>
          </div>
        </section>

        <section className="section section--sage" aria-labelledby="stays-title">
          <div className="container">
            <div className="section-head section-head--row" data-reveal>
              <div>
                <p className="eyebrow eyebrow--light">Nearby hotels</p>
                <h2 className="section-title" id="stays-title">
                  Places to Stay
                </h2>
              </div>
              <Link className="btn btn-outline btn--white" href="/places-to-stay">
                All lodging options
              </Link>
            </div>
            <ul className="stays-grid">
              {stays.map((stay, index) => (
                <li key={stay.id} data-reveal style={delay(index * 90)}>
                  <StayTile stay={stay} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" aria-labelledby="registry-title">
          <div className="container container--narrow center" data-reveal>
            <p className="eyebrow">Gifts</p>
            <h2 className="section-title" id="registry-title">
              Registry
            </h2>
            <p className="prose">
              Your presence means the world to us. If you&rsquo;d like to give a gift, we have a
              trip fund and a traditional registry — we appreciate either one.
            </p>
            <Link className="btn btn-outline" href="/registry">
              Visit the registry
            </Link>
          </div>
        </section>

        <section className="section section--stone" aria-labelledby="faq-title">
          <div className="container container--narrow">
            <div className="section-head section-head--row" data-reveal>
              <div>
                <p className="eyebrow">Good to know</p>
                <h2 className="section-title" id="faq-title">
                  Questions
                </h2>
              </div>
              <Link className="btn btn-outline" href="/faq">
                All FAQs
              </Link>
            </div>
            <div className="faq-list" data-reveal style={delay(100)}>
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
