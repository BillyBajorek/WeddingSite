import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { QuickJump } from "@/components/details/quick-jump";
import { stayMapUrl, stays } from "@/content/stays";
import { wedding } from "@/content/wedding";

export const metadata: Metadata = {
  title: "Places to Stay",
  description: `Hotels near ${wedding.venueShort} for the weekend of ${wedding.dateLabel}.`,
};

const nearest = stays.reduce((closest, stay) =>
  parseFloat(stay.distance) < parseFloat(closest.distance) ? stay : closest,
);

const notes = [
  {
    title: "The venue",
    body: `${wedding.venueShort} is at ${wedding.address}. The ceremony, cocktails, and reception are all on the property.`,
  },
  {
    title: "Parking",
    body: "Parking at the venue is free, so you only need the car to get there and back.",
  },
  {
    title: "Rates",
    body: `Prices are typical nightly ranges, before tax, and they change with the date. Book ahead for ${wedding.dateLabel}.`,
  },
];

export default function PlacesToStayPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHero
        eyebrow="Howell, Michigan"
        title="Places to Stay"
        lede={`A few hotels near ${wedding.venueShort} for the weekend. The closest is about ${nearest.distance} away.`}
      />
      <QuickJump targets={stays.map((stay) => ({ id: stay.id, label: stay.shortName }))} />

      <section className="section section--tight" aria-labelledby="lodging-title">
        <div className="container container--narrow center" data-reveal>
          <p className="eyebrow">For out-of-town guests</p>
          <h2 className="section-title" id="lodging-title">
            Where to sleep
          </h2>
          <p className="prose">
            You don&rsquo;t need to go anywhere once the day starts. If you&rsquo;re staying overnight,
            these are the hotels we&rsquo;d look at first. The nearest is {nearest.name},{" "}
            {nearest.distance} from the venue.
          </p>
        </div>
        <div className="container">
          <dl className="facts facts--three" data-reveal>
            {notes.map((note) => (
              <div key={note.title}>
                <dt>{note.title}</dt>
                <dd>{note.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section--stone" aria-label="Hotels">
        <div className="container">
          <ol className="lodging">
            {stays.map((stay, index) => {
              const [amount, unit] = stay.distance.split(" ");
              return (
                <li
                  key={stay.id}
                  id={stay.id}
                  className="lodging-stay"
                  data-reveal
                  style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}
                >
                  <p className="lodging-distance">
                    {amount}
                    <span>{unit} away</span>
                  </p>
                  <div>
                    <h2 className="lodging-name">{stay.name}</h2>
                    <p className="lodging-meta">
                      {stay.hotelClass} <span aria-hidden="true">·</span>{" "}
                      <span className="lodging-star" aria-hidden="true">
                        ★
                      </span>{" "}
                      {stay.rating.toFixed(1)}
                      <span className="sr-only"> out of 5</span>
                    </p>
                    <p className="lodging-amenities">{stay.amenities.join(" · ")}</p>
                  </div>
                  <div className="lodging-book">
                    <p className="lodging-price">
                      {stay.price}
                      <span> / night</span>
                    </p>
                    <a className="btn btn-outline" href={stayMapUrl(stay)} target="_blank" rel="noreferrer">
                      Open in Google Maps
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}
