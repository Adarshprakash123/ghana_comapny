export type SearchFilterConfig =
  | {
      label: string;
      type: "checkbox-list";
      panelAlign: "left" | "right";
      footerLabel: string;
      options: string[];
    }
  | {
      label: string;
      type: "price-range";
      panelAlign: "left" | "right";
      footerLabel: string;
      minPrice: string;
      maxPrice: string;
    };

export type PropertyListing = {
  id: string;
  city: string;
  location: string;
  title: string;
  type: string;
  status: "For Sale" | "For Rent";
  meta: string;
  description: string;
  price: string;
  beds: string;
  baths: string;
  parking: string;
  image: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  createdAt: string;
};

export type SiteSettings = {
  googleFormUrl: string;
};

export const propertyStorageKey = "fairhaven-admin-properties";
export const filterStorageKey = "fairhaven-admin-search-filters";
export const blogStorageKey = "fairhaven-admin-blogs";

export const defaultSearchFilters: SearchFilterConfig[] = [
  {
    label: "Looking for",
    type: "checkbox-list",
    panelAlign: "left",
    footerLabel: "Property Filter",
    options: [
      "Select All",
      "Apartment",
      "House",
      "Land",
      "Office",
      "Retail",
      "Townhouse",
      "Warehouse"
    ]
  },
  {
    label: "Location",
    type: "checkbox-list",
    panelAlign: "left",
    footerLabel: "Location Filter",
    options: [
      "Select All",
      "Abelemkpe",
      "Aburi",
      "Achimota",
      "Adjiringanor",
      "Airport Hills",
      "Airport Residential",
      "Asylum Down",
      "Cantonments",
      "Dzorwulu",
      "East Airport",
      "East Legon"
    ]
  },
  {
    label: "Price Range",
    type: "price-range",
    panelAlign: "left",
    footerLabel: "Price Filter",
    minPrice: "GHC 1",
    maxPrice: "GHC 100M+"
  },
  {
    label: "Property Type",
    type: "checkbox-list",
    panelAlign: "right",
    footerLabel: "Property Filter",
    options: ["Select All", "For Sale", "For Rent"]
  },
  {
    label: "Bedrooms",
    type: "checkbox-list",
    panelAlign: "right",
    footerLabel: "Bedroom Filter",
    options: ["Select All", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5+ Bedrooms"]
  }
];

export const defaultProperties: PropertyListing[] = [
  {
    id: "airport-residential-apartment",
    city: "Accra",
    location: "Airport Residential",
    title: "3 Bedroom Modern Apartment in Airport Residential",
    type: "Apartment",
    status: "For Sale",
    meta: "Apartment | 6125s",
    description:
      "An architectural statement of refined living in the heart of Accra's most prestigious neighbourhood.",
    price: "GHC 10,828,630",
    beds: "3 Bedrooms",
    baths: "4 Bathrooms",
    parking: "1 Parking Spaces",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: "airport-hills-house",
    city: "Accra",
    location: "Airport Hills",
    title: "4 Bedroom House in Airport Hills",
    type: "House",
    status: "For Sale",
    meta: "House | 5992s",
    description:
      "This beautifully designed furnished 4-bedroom house in Airport Hills offers modern comfort and privacy.",
    price: "GHC 17,250,000",
    beds: "4 Bedrooms",
    baths: "4.5 Bathrooms",
    parking: "Parking Spaces",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: "east-legon-residence",
    city: "Accra",
    location: "East Legon",
    title: "Modern Family Residence in East Legon",
    type: "House",
    status: "For Rent",
    meta: "House | 4388s",
    description:
      "Spacious interiors, strong rental potential and an address designed for easy family living.",
    price: "GHC 8,950,000",
    beds: "5+ Bedrooms",
    baths: "5 Bathrooms",
    parking: "2 Parking Spaces",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: "cantonments-villa",
    city: "Accra",
    location: "Cantonments",
    title: "Contemporary Villa in Cantonments",
    type: "House",
    status: "For Sale",
    meta: "Villa | 7100s",
    description:
      "Private luxury living with elegant outdoor spaces, curated finishes and strong investor appeal.",
    price: "GHC 21,400,000",
    beds: "5+ Bedrooms",
    baths: "6 Bathrooms",
    parking: "4 Parking Spaces",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80"
  }
];
