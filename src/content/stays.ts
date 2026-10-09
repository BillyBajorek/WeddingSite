import { wedding } from "@/content/wedding";

export type Stay = {
  id: string;
  name: string;
  /** Short label for the section jump on the lodging page. */
  shortName: string;
  hotelClass: string;
  rating: number;
  distance: string;
  price: string;
  amenities: string[];
  /** Path under /public. Tiles without a photo render a styled placeholder. */
  image?: string;
  imageAlt?: string;
};

export function stayMapUrl(stay: Stay) {
  const query = `${stay.name} near ${wedding.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const stays: Stay[] = [
  {
    id: "best-western-hartland",
    name: "Best Western of Hartland",
    shortName: "Best Western",
    hotelClass: "2-Star Hotel",
    rating: 4.2,
    distance: "1.1 mi",
    price: "$149–$189",
    amenities: ["Free breakfast", "Pool"],
  },
  {
    id: "hampton-inn-suites",
    name: "Hampton Inn and Suites",
    shortName: "Hampton Inn",
    hotelClass: "3-Star Hotel",
    rating: 4.4,
    distance: "11 mi",
    price: "$90–$120",
    amenities: ["Pool", "Gym", "Free breakfast"],
  },
  {
    id: "maple-grove-hotel",
    name: "Maple Grove Hotel",
    shortName: "Maple Grove",
    hotelClass: "2-Star Hotel",
    rating: 4.0,
    distance: "8.2 mi",
    price: "$109–$149",
    amenities: ["Breakfast", "Late checkout"],
  },
];
