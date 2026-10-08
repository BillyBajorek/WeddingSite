"use client";

import Image from "next/image";
import { useState } from "react";

const photos = [
  {
    src: "/images/story-first-trip.jpg",
    alt: "Billy and Brenna on their first trip together",
    caption: "Our first trip",
    width: 1400,
    height: 1050,
  },
  {
    src: "/images/story-proposal.jpg",
    alt: "Billy and Brenna right after the proposal",
    caption: "She said yes!",
    width: 1343,
    height: 996,
  },
];

export function Polaroids() {
  const [front, setFront] = useState(0);

  return (
    <div className="story-media">
      {photos.map((photo, i) => {
        const isFront = i === front;
        return (
          <button
            key={photo.src}
            type="button"
            className={`polaroid polaroid-${i}${isFront ? " is-front" : ""}`}
            onClick={() => setFront(isFront ? (i + 1) % photos.length : i)}
            aria-label={isFront ? "Show the next photo" : `Bring “${photo.caption}” to the front`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 880px) 80vw, 440px"
            />
            <span className="polaroid-caption">{photo.caption}</span>
          </button>
        );
      })}
    </div>
  );
}
