import type { StaticImageData } from "next/image";
import eventPhoto from "@/public/solutions/service-hero-fallback.jpg";

export type LeadershipEvent = {
  slug: string;
  title: string;
  category: string;
  kind: string;
  dateLabel: string;
  location: string;
  summary: string;
  overview: string[];
  topics: string[];
  image?: string | StaticImageData;
  imageAlt?: string;
  featured?: boolean;
  status?: "past" | "upcoming";
};

// Provisional editorial examples for the Events layout. Replace with the
// approved programme before publishing; no dates, venues or speakers are claimed.
export const events: LeadershipEvent[] = [
  {
    slug: "leadership-in-a-changing-world",
    title: "Leadership in a changing world.",
    category: "Leadership",
    kind: "Leadership forum",
    dateLabel: "Date to be announced",
    location: "Location to be announced",
    summary: "A conversation about leading with clarity, humanity and purpose when the world around us is changing.",
    overview: [
      "Explore the questions that matter to leaders today: how to make sense of complexity, create shared direction and turn intention into meaningful action.",
      "This forum brings the inner and outer dimensions of leadership into one conversation, connecting personal perspective with the needs of teams and organisations.",
    ],
    topics: ["Leading through complexity and change", "Connecting purpose with everyday decisions", "Building the conditions for lasting impact"],
    image: eventPhoto,
    imageAlt: "Leaders gathered for a conversation",
    featured: true,
  },
  {
    slug: "leading-as-one",
    title: "Leading as one.",
    category: "Executive teams",
    kind: "Leadership roundtable",
    dateLabel: "Date to be announced",
    location: "Location to be announced",
    summary: "Explore what helps an executive team move beyond individual performance towards shared direction and collective impact.",
    overview: [
      "Strong individual leaders are only the beginning. Collective leadership depends on the quality of the relationships, conversations and decisions between them.",
      "This roundtable explores how executive teams build trust, navigate different perspectives and align around the work that matters most.",
    ],
    topics: ["Trust and productive challenge at the top table", "Shared direction and collective accountability", "Turning team alignment into organisational impact"],
  },
  {
    slug: "the-whole-leader",
    title: "The whole leader.",
    category: "The 5H® Framework",
    kind: "Leadership conversation",
    dateLabel: "Date to be announced",
    location: "Location to be announced",
    summary: "A fresh perspective on leadership through Head, Heart, Hunch, Hands and Habits — and how they work together under pressure.",
    overview: [
      "Leadership asks more of us than knowledge alone. The 5H® Framework connects five forms of intelligence to develop the whole self in leadership.",
      "This conversation explores the relationship between the inner and outer game, and how awareness becomes consistent action in the moments that matter.",
    ],
    topics: ["The five connected leadership intelligences", "Understanding the inner and outer game", "Developing habits that make learning real"],
  },
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}
