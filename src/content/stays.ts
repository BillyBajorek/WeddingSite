export type Stay = {
  id: string;
  name: string;
  hotelClass: string;
  rating: number;
  distance: string;
  price: string;
  amenities: string[];
  /** Path under /public. Tiles without a photo render a styled placeholder. */
  image?: string;
  imageAlt?: string;
};

export const stays: Stay[] = [
  {
    id: "best-western-hartland",
    name: "Best Western of Hartland",
    hotelClass: "2-Star Hotel",
    rating: 4.2,
    distance: "1.1 mi",
    price: "$149–$189",
    amenities: ["Free breakfast", "Pool"],
  },
  {
    id: "hampton-inn-suites",
    name: "Hampton Inn and Suites",
    hotelClass: "3-Star Hotel",
    rating: 4.4,
    distance: "11 mi",
    price: "$90–$120",
    amenities: ["Pool", "Gym", "Free breakfast"],
  },
  {
    id: "maple-grove-hotel",
    name: "Maple Grove Hotel",
    hotelClass: "2-Star Hotel",
    rating: 4.0,
    distance: "8.2 mi",
    price: "$109–$149",
    amenities: ["Breakfast", "Late checkout"],
  },
];
