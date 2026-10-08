import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { StoryPath } from "@/components/story/story-path";
import { moments, storyIntro } from "@/content/story";
import { wedding } from "@/content/wedding";

export const metadata: Metadata = {
  title: "Our Story",
  description: `How ${wedding.couple} got here, one moment at a time.`,
};

export default function OurStoryPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero title="Our Story" lede={storyIntro} />

      <div className="section story-page">
        <StoryPath>
          <span className="story-start" data-story-anchor aria-hidden="true" />
          <ol className="story-moments">
            {moments.map((moment, index) => (
              <li
                key={moment.id}
                id={moment.id}
                className={`moment moment--${moment.layout}`}
                style={{ "--tilt": `${index % 2 ? 2 : -2}deg` } as React.CSSProperties}
              >
                <figure
                  className={`moment-photo${moment.height > moment.width ? " moment-photo--tall" : ""}`}
                  data-story-anchor
                  data-reveal
                >
                  <Image
                    src={moment.image}
                    alt={moment.alt}
                    width={moment.width}
                    height={moment.height}
                    sizes="(max-width: 720px) 78vw, 440px"
                  />
                </figure>
                <div
                  className="moment-text"
                  data-reveal
                  style={{ "--delay": "120ms" } as React.CSSProperties}
                >
                  <h2 className="moment-when">{moment.when}</h2>
                  <p>{moment.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <section className="story-end" aria-labelledby="story-end-title">
            <span className="story-end-dot" data-story-anchor aria-hidden="true" />
            <p className="eyebrow">The next chapter</p>
            <h2 className="section-title" id="story-end-title">
              {wedding.dateLabel}
            </h2>
            <p className="prose">
              We can&rsquo;t wait to celebrate it with you at {wedding.venueShort}.
            </p>
            <Link className="btn btn-primary" href="/rsvp">
              RSVP
            </Link>
          </section>
        </StoryPath>
      </div>
    </main>
  );
}
