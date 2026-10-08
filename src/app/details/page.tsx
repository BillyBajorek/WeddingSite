import type { Metadata } from "next";
import Image from "next/image";
import { Itinerary } from "@/components/details/itinerary";
import { QuickJump, type JumpTarget } from "@/components/details/quick-jump";
import { Reveal } from "@/components/reveal";
import { dietTags, itinerary, mapUrl, menu, venueFacts, type MenuItem } from "@/content/details";

export const metadata: Metadata = {
  title: "Details",
  description: "Venue, schedule, and menu for the wedding day.",
};

const jumpTargets: JumpTarget[] = [
  { id: "itinerary", label: "Itinerary" },
  { id: "venue", label: "Venue" },
  { id: "menu", label: "Menu" },
];

function Dish({ item, index }: { item: MenuItem; index: number }) {
  return (
    <li
      className="menu-item"
      data-reveal
      style={{ "--delay": `${120 + index * 80}ms` } as React.CSSProperties}
    >
      <span className="menu-item-name">{item.name}</span>
      {(item.desc || item.tags) && (
        <span className="menu-item-desc">
          {item.desc}
          {item.tags?.map((tag) => (
            <abbr key={tag} className="diet-tag" title={dietTags[tag]}>
              {tag}
            </abbr>
          ))}
        </span>
      )}
    </li>
  );
}

export default function DetailsPage() {
  return (
    <main id="main" className="details-page" tabIndex={-1}>
      <QuickJump targets={jumpTargets} />

      <header className="page-header">
        <h1>Wedding Day Details</h1>
        <p>We can&rsquo;t wait to celebrate with you! Everything you need for the day is below.</p>
      </header>

      <section id="itinerary" className="itinerary" aria-labelledby="itinerary-title">
        <h2 className="details-heading details-heading--light" id="itinerary-title">
          Itinerary
        </h2>
        <Itinerary items={itinerary} />
      </section>

      <div className="details-cards">
        <section id="venue" className="card details-card" aria-labelledby="venue-title">
          <h2 className="details-heading" id="venue-title">
            Venue Details
          </h2>
          <div className="venue">
            <Image
              className="venue-photo"
              src="/images/waldenwoods.jpg"
              alt="Waldenwoods banquet pavilion with its gold crest"
              width={757}
              height={238}
              sizes="(max-width: 760px) 90vw, 380px"
            />
            <div>
              <dl className="venue-facts">
                {venueFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="venue-actions">
                <a className="btn btn-outline" href={mapUrl} target="_blank" rel="noreferrer">
                  Open in Google Maps
                </a>
                <a className="btn btn-outline" href="#itinerary">
                  See the schedule
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="card details-card" aria-labelledby="menu-title">
          <h2 className="details-heading" id="menu-title">
            Menu
          </h2>
          <p className="menu-intro">
            Subject to minor changes. Please let us know about any allergies or dietary needs.
          </p>
          <p className="menu-legend">
            {Object.entries(dietTags).map(([tag, label]) => (
              <span key={tag}>
                <abbr className="diet-tag" title={label}>
                  {tag}
                </abbr>{" "}
                {label}
              </span>
            ))}
          </p>
          <Reveal className="menu-grid">
            {menu.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="menu-card"
                data-reveal
                style={{ "--delay": "60ms" } as React.CSSProperties}
              >
                <h3 className="menu-title">{section.title}</h3>
                <ul className={`menu-list${section.columns ? " menu-list--columns" : ""}`}>
                  {section.items.map((item, index) => (
                    <Dish key={item.name} item={item} index={index} />
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </section>
      </div>
    </main>
  );
}
