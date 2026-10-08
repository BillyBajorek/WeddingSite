export type StoryLayout = "photo-left" | "photo-right" | "photo-center";

export type StoryMoment = {
  id: string;
  when: string;
  text: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  /** Where the photo sits; the text takes the other side (or goes underneath for center). */
  layout: StoryLayout;
};

export const storyIntro = "A few of our favorite moments along the way.";

export const moments: StoryMoment[] = [
  {
    id: "spring-2019",
    when: "Spring 2019",
    text: "On April 10th, Billy and Brenna went on their first date at Vinsetta Garage.",
    image: "/images/story-first-trip.jpg",
    width: 1400,
    height: 1050,
    alt: "Billy and Brenna sharing a kiss on Bow Bridge in Central Park",
    layout: "photo-left",
  },
  {
    id: "prom",
    when: "Later in the Spring",
    text: "Billy asked Brenna to Senior prom, which she happily accepted.",
    image: "/images/story-prom.jpg",
    width: 1400,
    height: 1050,
    alt: "Signs spelling out “PROM?” hanging above a school auditorium stage",
    layout: "photo-right",
  },
  {
    id: "summer-2019",
    when: "Summer 2019",
    text: "Shortly after, they graduated from Fraser High School together.",
    image: "/images/story-graduation.jpg",
    width: 1050,
    height: 1400,
    alt: "Billy and Brenna in their caps and gowns at graduation",
    layout: "photo-center",
  },
];
