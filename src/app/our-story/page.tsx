import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { StoryPath } from "@/components/story/story-path";
import { moments, storyIntro } from "@/content/story";
import { wedding } from "@/content/wedding";

export const metadata: Metadata = {
  title: "Our Story",
  description: `How ${wedding.couple} got here, one moment at a time.`,
};

export default function OurStoryPage() {
  return (
    <main id="main" className="story-page" tabIndex={-1}>
      <header className="page-header">
        <h1>Our Story</h1>
        <p>{storyIntro}</p>
      </header>

      <StoryPath>
        <span className="story-start" data-story-anchor aria-hidden="true" />
        <Reveal>
          <ol className="story-moments">
            {moments.map((moment, index) => (
              <li
                key={moment.id}
                id={moment.id}
                className={`moment moment--${moment.layout}`}
                style={{ "--tilt": `${index % 2 ? 2.5 : -2.5}deg` } as React.CSSProperties}
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
                <div className="moment-text" data-reveal style={{ "--delay": "150ms" } as React.CSSProperties}>
                  <h2 className="moment-when">{moment.when}</h2>
                  <p>{moment.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <section className="story-end" aria-labelledby="story-end-title">
          <span className="story-end-dot" data-story-anchor aria-hidden="true" />
          <p className="eyebrow eyebrow--light">The next chapter</p>
          <h2 className="story-end-title" id="story-end-title">
            {wedding.dateLabel}
          </h2>
          <p>We can&rsquo;t wait to celebrate it with you at {wedding.venueShort}.</p>
          <Link className="btn btn-outline btn--white" href="/rsvp">
            RSVP
          </Link>
        </section>
      </StoryPath>
    </main>
  );
}
