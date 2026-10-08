import Image from "next/image";
import Link from "next/link";
import type { Stay } from "@/content/stays";

export function StayTile({ stay }: { stay: Stay }) {
  return (
    <Link className="stay-tile" href={`/places-to-stay#${stay.id}`}>
      {stay.image && (
        <div className="stay-pic">
          <Image
            src={stay.image}
            alt={stay.imageAlt ?? stay.name}
            fill
            sizes="(max-width: 720px) 92vw, 360px"
          />
        </div>
      )}
      <div className="stay-body">
        <p className="stay-distance">{stay.distance} from the venue</p>
        <h3 className="stay-name">{stay.name}</h3>
        <p className="stay-meta">
          {stay.hotelClass} <span aria-hidden="true">·</span>{" "}
          <span className="stay-rating">
            <span aria-hidden="true">★</span> {stay.rating.toFixed(1)}
            <span className="sr-only"> out of 5</span>
          </span>
        </p>
        <p className="stay-amenities">{stay.amenities.join(" · ")}</p>
        <div className="stay-actions">
          <span className="stay-price">
            {stay.price}
            <span className="stay-price-unit"> / night</span>
          </span>
          <span className="stay-view" aria-hidden="true">
            View <span className="arrow">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
