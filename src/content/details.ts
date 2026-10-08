import { wedding } from "@/content/wedding";

export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${wedding.venue}, ${wedding.address}`,
)}`;

export const venueFacts: { label: string; value: string }[] = [
  { label: "Venue", value: wedding.venue },
  { label: "Address", value: wedding.address },
  { label: "Seating", value: "Please be seated before the 4:00 PM ceremony" },
  { label: "Ceremony", value: "4:00 PM (lawn overlooking the lake)" },
  { label: "Parking", value: "On-site parking; attendants will direct you" },
  { label: "Dress code", value: "Garden party semi-formal (grass lawn—consider block heels)" },
];

export type ItineraryItem = {
  id: string;
  title: string;
  time: string;
  brief: string;
  location: string;
  duration: string;
  notes: string;
  accessibility?: string;
  showMap?: boolean;
};

export const itinerary: ItineraryItem[] = [
  {
    id: "ceremony",
    title: "Lakeside Ceremony",
    time: "4:00 PM",
    brief: "Our vows by the lake.",
    location: "Ceremony lawn",
    duration: "About an hour",
    notes: "We may finish a little before 5:00, which leaves extra time before cocktail hour.",
    accessibility: "Wheelchair friendly via a paved path.",
    showMap: true,
  },
  {
    id: "cocktail",
    title: "Cocktail Hour",
    time: "5:00 PM",
    brief: "Hors d’oeuvres and drinks.",
    location: "The grounds",
    duration: "Until 5:45 PM",
    notes:
      "From 5:00 to 5:45 the bridal party and family will be taking photos. If the ceremony ends early, cocktail hour starts a little sooner.",
    accessibility: "Seating throughout.",
  },
  {
    id: "entrance",
    title: "Bridal Party Entrance",
    time: "5:45 PM",
    brief: "The wedding party makes their entrance.",
    location: "Ballroom",
    duration: "A few minutes",
    notes: "",
  },
  {
    id: "first-dance",
    title: "First Dance",
    time: "6:00 PM",
    brief: "Our first dance.",
    location: "Ballroom",
    duration: "",
    notes: "",
  },
  {
    id: "dinner",
    title: "Dinner & Speeches",
    time: "6:30 PM",
    brief: "Dinner is served, along with toasts.",
    location: "Ballroom",
    duration: "",
    notes: "",
    accessibility: "Accessible hall and restrooms.",
  },
  {
    id: "cake",
    title: "Cake Cutting",
    time: "7:30 PM",
    brief: "We’ll cut the cake.",
    location: "Ballroom",
    duration: "",
    notes: "",
  },
  {
    id: "late-night",
    title: "Late Night Snack",
    time: "9:30 PM",
    brief: "A late-night bite to keep the party going.",
    location: "Ballroom",
    duration: "",
    notes: "",
  },
];

export type DietTag = "V" | "GF";

export const dietTags: Record<DietTag, string> = {
  V: "Vegetarian",
  GF: "Gluten-free",
};

export type MenuItem = { name: string; desc?: string; tags?: DietTag[] };

export type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
};

/** Each course is one column of the menu card. */
export type MenuCourse = { title: string; sections: MenuSection[] };

const sections: MenuSection[] = [
  {
    id: "cocktail-hour",
    title: "Hors d’oeuvres",
    items: [
      { name: "Caprese Skewers", tags: ["V", "GF"] },
      { name: "Spinach & Artichoke Tartlets", tags: ["V"] },
      { name: "Chicken Satay with Peanut Sauce", tags: ["GF"] },
      { name: "Shrimp Cocktail", tags: ["GF"] },
      { name: "Seasonal Crudités & Herb Dip", tags: ["V"] },
    ],
  },
  {
    id: "bar-menu",
    title: "Bar",
    items: [
      { name: "Beer", desc: "Domestic & craft selection" },
      { name: "Wine", desc: "Red & white varieties" },
      { name: "Signature Cocktails", desc: "Bride’s & Groom’s favorites" },
      { name: "Non-Alcoholic", desc: "Sodas, lemonade, iced tea" },
      { name: "Coffee & Tea", desc: "Available with dessert" },
    ],
  },
  {
    id: "entrees",
    title: "Entrées",
    items: [
      { name: "Lemon Baked Chicken", desc: "Herb butter, lemon pan jus", tags: ["GF"] },
      { name: "Chicken Alfredo", desc: "Creamy parmesan alfredo over pasta" },
      { name: "Spaghetti", desc: "House red sauce, grated parmesan", tags: ["V"] },
    ],
  },
  {
    id: "sides",
    title: "Sides",
    items: [
      { name: "Garlic Mashed Potatoes", tags: ["GF"] },
      { name: "Roasted Seasonal Vegetables", tags: ["V", "GF"] },
      { name: "House Salad", desc: "Balsamic & ranch on the side", tags: ["V", "GF"] },
      { name: "Warm Rolls & Butter", tags: ["V"] },
    ],
  },
  {
    id: "dessert",
    title: "Dessert",
    items: [
      { name: "Wedding Cake", desc: "Assorted flavors" },
      { name: "Cupcakes", desc: "Variety assortment" },
      { name: "Brownies", desc: "Rich chocolate" },
    ],
  },
];

const pick = (...ids: string[]) => ids.map((id) => sections.find((section) => section.id === id)!);

export const menu: MenuCourse[] = [
  { title: "Cocktail Hour", sections: pick("cocktail-hour", "bar-menu") },
  { title: "Dinner", sections: pick("entrees", "sides", "dessert") },
];
