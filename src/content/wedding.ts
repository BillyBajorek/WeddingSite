export const wedding = {
  couple: "Billy & Brenna",
  dateLabel: "September 12th, 2027",
  // Ceremony start in Michigan time (EDT). The countdown counts down to this instant.
  startsAt: "2027-09-12T17:30:00-04:00",
  venue: "Waldenwoods Banquet and Conference Center",
  address: "2975 Old US-23, Howell, MI 48855",
  venueShort: "Waldenwoods",
};

export type NavItem = { href: string; label: string };

export const navLeft: NavItem[] = [
  { href: "/details", label: "Details" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/our-story", label: "Our Story" },
];

export const navRight: NavItem[] = [
  { href: "/registry", label: "Registry" },
  { href: "/places-to-stay", label: "Places to Stay" },
  { href: "/faq", label: "FAQ" },
];

export const navItems = [...navLeft, ...navRight];
