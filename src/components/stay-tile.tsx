import Image from "next/image";
import Link from "next/link";
import type { Stay } from "@/content/stays";

export function StayTile({ stay }: { stay: Stay }) {
  return (
    <Link className="stay-tile" href={`/places-to-stay#${stay.id}`}>
      <div className="stay-pic">
        {stay.image ? (
          <Image
            src={stay.image}
            alt={stay.imageAlt ?? stay.name}
            fill
            sizes="(max-width: 620px) 92vw, 320px"
          />
        ) : (
          <div className="stay-pic-placeholder" aria-hidden="true">
            <span>{stay.name}</span>
          </div>
        )}
        <span className="stay-badge">{stay.distance} from venue</span>
      </div>
      <div className="stay-body">
        <h3 className="stay-name">{stay.name}</h3>
        <div className="stay-row">
          <span className="hotel-class">{stay.hotelClass}</span>
          <span
            className="rating"
            role="img"
            style={{ "--rating": stay.rating } as React.CSSProperties}
            aria-label={`Rated ${stay.rating.toFixed(1)} out of 5`}
          />
          <span className="rating-num" aria-hidden="true">
            {stay.rating.toFixed(1)}
          </span>
          {stay.amenities.map((a) => (
            <span className="stay-chip" key={a}>
              {a}
            </span>
          ))}
        </div>
        <div className="stay-actions">
          <span className="stay-price">
            {stay.price}
            <span className="stay-price-unit"> / night</span>
          </span>
          <span className="btn btn-outline stay-view" aria-hidden="true">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
