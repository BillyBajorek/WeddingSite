import { wedding } from "@/content/wedding";

export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${wedding.venue}, ${wedding.address}`,
)}`;

export const venueFacts: { label: string; value: string }[] = [
  { label: "Venue", value: wedding.venue },
  { label: "Address", value: wedding.address },
  { label: "Seating", value: "Begins at 5:00 PM" },
  { label: "Ceremony", value: "5:30 PM (lawn overlooking the lake)" },
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
    id: "arrivals",
    title: "Guest Arrivals & Seating",
    time: "5:00 PM",
    brief: "Arrive, park, and find your seat at the ceremony lawn.",
    location: "Ceremony Lawn (lakeside)",
    duration: "30 minutes",
    notes: "Ushers will help; water/lemonade available.",
    accessibility: "Wheelchair friendly via paved path.",
    showMap: true,
  },
  {
    id: "ceremony",
    title: "Ceremony",
    time: "5:30 PM",
    brief: "Our “I do”s by the lake.",
    location: "Ceremony Lawn",
    duration: "25–30 minutes",
    notes: "Unplugged ceremony—please silence phones.",
    accessibility: "Priority seating upon request.",
    showMap: true,
  },
  {
    id: "photos",
    title: "Family Photos",
    time: "6:05 PM",
    brief: "Family & wedding party portraits.",
    location: "Garden & lakeside path",
    duration: "25 minutes",
    notes: "Guests proceed to cocktail hour.",
    accessibility: "Short walk on level ground.",
  },
  {
    id: "cocktail",
    title: "Cocktail Hour",
    time: "6:10 PM",
    brief: "Drinks & hors d’oeuvres.",
    location: "Terrace & foyer",
    duration: "50 minutes",
    notes: "Open bar; lawn games available.",
    accessibility: "Seating throughout.",
  },
  {
    id: "reception",
    title: "Reception & Dinner",
    time: "7:00 PM",
    brief: "Grand entrance, toasts, dinner service.",
    location: "Banquet Hall",
    duration: "2 hours",
    notes: "Entrées: Lemon Baked Chicken, Spaghetti, Chicken Alfredo.",
    accessibility: "Accessible hall and restrooms.",
  },
  {
    id: "dancing",
    title: "Dancing & Dessert",
    time: "8:45 PM",
    brief: "First dances, open dance floor, dessert table.",
    location: "Banquet Hall",
    duration: "Until close",
    notes: "Desserts: Cake, Cupcakes, Brownies.",
  },
  {
    id: "sendoff",
    title: "Sparkler Send-Off",
    time: "10:30 PM",
    brief: "Help us end the night with a glow!",
    location: "Front courtyard",
    duration: "15 minutes",
    notes: "Sparklers provided; attendants will guide lines.",
    accessibility: "Flat paved area.",
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
  /** Bar items render in two columns on wide screens. */
  columns?: boolean;
  items: MenuItem[];
};

export const menu: MenuSection[] = [
  {
    id: "cocktail-hour",
    title: "Cocktail Hour — Hors d’oeuvres",
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
    title: "Bar Menu",
    columns: true,
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
