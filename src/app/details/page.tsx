import type { Metadata } from "next";
import Image from "next/image";
import { Itinerary } from "@/components/details/itinerary";
import { QuickJump, type JumpTarget } from "@/components/details/quick-jump";
import { PageHero } from "@/components/page-hero";
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

function Dish({ item }: { item: MenuItem }) {
  return (
    <li className="menu-item">
      <span className="menu-item-name">
        {item.name}
        {item.tags?.map((tag) => (
          <abbr key={tag} className="diet-tag" title={dietTags[tag]}>
            {tag}
          </abbr>
        ))}
      </span>
      {item.desc && <span className="menu-item-desc">{item.desc}</span>}
    </li>
  );
}

export default function DetailsPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero
        title="Wedding Day Details"
        lede="We can’t wait to celebrate with you. Everything you need for the day is below."
      />
      <QuickJump targets={jumpTargets} />

      <section id="itinerary" className="section section--tight" aria-labelledby="itinerary-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">September 12</p>
            <h2 className="section-title" id="itinerary-title">
              Itinerary
            </h2>
          </div>
        </div>
        <Itinerary items={itinerary} />
      </section>

      <section id="venue" className="section section--stone" aria-labelledby="venue-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Where</p>
            <h2 className="section-title" id="venue-title">
              The Venue
            </h2>
          </div>
          <div className="venue" data-reveal>
            <Image
              className="venue-photo"
              src="/images/waldenwoods.jpg"
              alt="Waldenwoods banquet pavilion with its gold crest"
              width={757}
              height={238}
              sizes="(max-width: 860px) 92vw, 520px"
            />
            <div>
              <dl className="info-list">
                {venueFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="button-row">
                <a className="btn btn-primary" href={mapUrl} target="_blank" rel="noreferrer">
                  Open in Google Maps
                </a>
                <a className="btn btn-outline" href="#itinerary">
                  See the schedule
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="section" aria-labelledby="menu-title">
        <div className="container">
          <div className="section-head center" data-reveal>
            <p className="eyebrow">Dinner</p>
            <h2 className="section-title" id="menu-title">
              The Menu
            </h2>
            <p className="section-lede">
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
          </div>
          <div className="menu-grid">
            {menu.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className={`menu-section${section.columns ? " menu-section--wide" : ""}`}
                data-reveal
                style={{ "--delay": `${(index % 2) * 80}ms` } as React.CSSProperties}
              >
                <h3 className="menu-title">{section.title}</h3>
                <ul className={`menu-list${section.columns ? " menu-list--columns" : ""}`}>
                  {section.items.map((item) => (
                    <Dish key={item.name} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
