/**
 * Corporate DNA offices — the fixed source of truth for the homepage locations
 * map + carousel (feature 003). Addresses are carried over verbatim from the
 * previous static "Our offices" grid; `coords`/`zoom` drive the Leaflet camera.
 * Order here defines the carousel order.
 */
export type Office = {
  slug: string;
  city: string;
  country: string;
  addressLines: string[];
  tel?: string | null;
  email: string;
  coords: { lng: number; lat: number };
  zoom: number;
};

export const offices: Office[] = [
  {
    slug: "london",
    city: "London",
    country: "United Kingdom",
    addressLines: ["60 St Martin's Ln, Covent Garden", "London WC2N 4JS"],
    tel: "+44 20 3755 5329",
    email: "london@corporatednaconsulting.com",
    coords: { lng: -0.12634, lat: 51.51054 },
    zoom: 16,
  },
  {
    slug: "miami",
    city: "Miami",
    country: "United States",
    addressLines: [
      "1221 Brickell Avenue, Suite 900",
      "Miami, Florida, 33131",
      "United States of America",
    ],
    tel: "+1 305-374-4611",
    email: "miami@corporatednaconsulting.com",
    coords: { lng: -80.19126, lat: 25.7612 },
    zoom: 16,
  },
  {
    slug: "singapore",
    city: "Singapore",
    country: "Singapore",
    addressLines: [
      "The Great Room, Afro Asia",
      "63 Robinson Road, Level 8",
      "Singapore 068894",
    ],
    tel: "+65 6995 2480",
    email: "singapore@corporatednaconsulting.com",
    coords: { lng: 103.84914, lat: 1.27893 },
    zoom: 16,
  },
  {
    slug: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    addressLines: [
      "Sheikh Rashid Tower, 4th Floor",
      "Dubai World Trade Centre",
      "Dubai — United Arab Emirates",
    ],
    tel: null,
    email: "dubai@corporatednaconsulting.com",
    coords: { lng: 55.28879, lat: 25.22762 },
    zoom: 16,
  },
  {
    slug: "saudi-arabia",
    city: "Riyadh",
    country: "Kingdom of Saudi Arabia",
    addressLines: [
      "2888 King Fahd Road, Saudi Journalists Association Building",
      "2nd Floor, Al Sahafah, Dist. 13671",
      "Riyadh, 13321, RASA6101",
    ],
    tel: null,
    email: "riyadh@corporatednaconsulting.com",
    coords: { lng: 46.6491, lat: 24.80085 },
    zoom: 16,
  },
];
