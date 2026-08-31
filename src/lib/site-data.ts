import { CATEGORIES as showcaseCategorySeed, PRODUCTS as productSeed, WHATSAPP_NUMBER } from "./products";

export type AdminRole = "super-admin" | "manager";
export type ProductState = "active" | "inactive";
export type EnquiryStatus = "new" | "contacted" | "interested" | "converted" | "closed";
export type OfferState = "active" | "inactive" | "expired";

export type ProductRecord = {
  id: string;
  name: string;
  sku: string;
  category: string;
  collection: string;
  material: string;
  purity: string;
  occasion: string;
  price: number;
  mrp: number;
  rating: number;
  image: string;
  images: string[];
  description: string;
  weight: string;
  stone: string;
  badge?: string;
  stock: number;
  lowStockLimit: number;
  active: boolean;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
};

export type CategoryRecord = {
  id: string;
  name: string;
  image: string;
  description: string;
  active: boolean;
};

export type CollectionRecord = {
  id: string;
  name: string;
  image: string;
  description: string;
  active: boolean;
  featured: boolean;
};

export type StockHistoryEntry = {
  id: string;
  productId: string;
  date: string;
  previousStock: number;
  quantityChanged: number;
  updatedStock: number;
  reason: string;
};

export type EnquiryRecord = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  requirement: string;
  budget: string;
  message: string;
  enquiryDate: string;
  status: EnquiryStatus;
  adminNotes: string;
};

export type OfferRecord = {
  id: string;
  offerName: string;
  couponCode: string;
  discountPercentage: number;
  startDate: string;
  expiryDate: string;
  applyTo: "all" | "product" | "category";
  selectionIds: string[];
  active: boolean;
};

export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  active: boolean;
};

export type PromoBanner = {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  active: boolean;
};

export type HomepageContent = {
  heroBanners: HeroBanner[];
  featuredProductIds: string[];
  newArrivalIds: string[];
  bestsellerIds: string[];
  featuredCategoryIds: string[];
  promotionalBanners: PromoBanner[];
  sectionVisibility: {
    hero: boolean;
    featuredProducts: boolean;
    newArrivals: boolean;
    bestsellers: boolean;
    categories: boolean;
    promotions: boolean;
  };
};

export type SiteSettings = {
  websiteLogo: string;
  businessName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  otherLinks: string;
  businessInformation: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  remember?: boolean;
};

export type SiteData = {
  products: ProductRecord[];
  categories: CategoryRecord[];
  collections: CollectionRecord[];
  enquiries: EnquiryRecord[];
  offers: OfferRecord[];
  homepage: HomepageContent;
  settings: SiteSettings;
  stockHistory: StockHistoryEntry[];
  adminUsers: AdminUser[];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const today = new Date();
const iso = (offsetDays = 0) => new Date(today.getTime() + offsetDays * 86400000).toISOString().slice(0, 10);

const categoryImagePool = showcaseCategorySeed.map((category) => category.image);

export const initialProducts: ProductRecord[] = productSeed.map((product, index) => {
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return {
    ...product,
    sku: `LUX-${String(index + 1).padStart(3, "0")}`,
    images: [product.image],
    stock: [18, 22, 6, 14, 0, 9, 4, 27][index] ?? 12,
    lowStockLimit: 5,
    active: true,
    featured: index < 4,
    bestseller: index === 2 || index === 6,
    newArrival: index === 0 || index === 1 || index === 7,
    badge: product.badge ?? (discount > 0 ? `${discount}% OFF` : undefined),
  };
});

export const initialCategories: CategoryRecord[] = Array.from(
  new Map(
    initialProducts.map((product, index) => [
      product.category,
      {
        id: slugify(product.category),
        name: product.category,
        image: categoryImagePool[index % categoryImagePool.length],
        description: `${product.category} pieces curated across the luxury collection.`,
        active: true,
      } satisfies CategoryRecord,
    ]),
  ).values(),
);

export const initialCollections: CollectionRecord[] = Array.from(
  new Map(
    initialProducts.map((product, index) => [
      product.collection,
      {
        id: slugify(product.collection),
        name: product.collection,
        image: product.image,
        description: `Hand-picked selection for ${product.collection.toLowerCase()}.`,
        active: true,
        featured: index < 4 || product.collection === "Wedding Collection",
      } satisfies CollectionRecord,
    ]),
  ).values(),
);

export const initialEnquiries: EnquiryRecord[] = [
  {
    id: "inq-001",
    customerName: "Ananya Mehta",
    phone: "919999111111",
    email: "ananya@example.com",
    requirement: "Bridal choker and bangles",
    budget: "$6,000",
    message: "Need a bridal set for a November wedding.",
    enquiryDate: iso(-1),
    status: "new",
    adminNotes: "",
  },
  {
    id: "inq-002",
    customerName: "Rohan Kapoor",
    phone: "919999222222",
    email: "rohan@example.com",
    requirement: "Diamond solitaire ring",
    budget: "$4,500",
    message: "Looking for an engagement ring with quick delivery.",
    enquiryDate: iso(-2),
    status: "contacted",
    adminNotes: "Shared shortlisted solitaire options on WhatsApp.",
  },
  {
    id: "inq-003",
    customerName: "Meera Iyer",
    phone: "919999333333",
    email: "meera@example.com",
    requirement: "Restore family choker",
    budget: "$2,000",
    message: "Need polishing, resizing, and stone replacement.",
    enquiryDate: iso(-3),
    status: "interested",
    adminNotes: "",
  },
];

export const initialOffers: OfferRecord[] = [
  {
    id: "offer-festive",
    offerName: "Festive Privilege",
    couponCode: "FESTIVE26",
    discountPercentage: 15,
    startDate: iso(-5),
    expiryDate: iso(15),
    applyTo: "category",
    selectionIds: [initialCategories[0]?.id ?? ""],
    active: true,
  },
  {
    id: "offer-bridal",
    offerName: "Bridal Trousseau",
    couponCode: "VIVAH",
    discountPercentage: 10,
    startDate: iso(-10),
    expiryDate: iso(20),
    applyTo: "product",
    selectionIds: [initialProducts[3]?.id ?? "", initialProducts[4]?.id ?? ""],
    active: true,
  },
];

export const initialHomepage: HomepageContent = {
  heroBanners: [
    {
      id: "hero-1",
      title: "Timeless Jewellery for Every Occasion",
      subtitle: "Handcrafted gold, diamond and bridal masterpieces.",
      ctaText: "Shop Now",
      ctaLink: "/shop",
      image: initialProducts[3]?.image ?? initialProducts[0].image,
      active: true,
    },
    {
      id: "hero-2",
      title: "Bridal Heirlooms, Reimagined",
      subtitle: "Curated bridal sets with modern elegance.",
      ctaText: "Explore Bridal",
      ctaLink: "/bridal",
      image: initialProducts[4]?.image ?? initialProducts[0].image,
      active: false,
    },
  ],
  featuredProductIds: initialProducts.slice(0, 4).map((product) => product.id),
  newArrivalIds: initialProducts.filter((product) => product.newArrival).map((product) => product.id),
  bestsellerIds: initialProducts.filter((product) => product.bestseller).map((product) => product.id),
  featuredCategoryIds: initialCategories.slice(0, 4).map((category) => category.id),
  promotionalBanners: [
    {
      id: "promo-1",
      title: "Private Bridal Consultation",
      subtitle: "Book a one-on-one appointment with our bridal stylist.",
      ctaText: "Book Now",
      ctaLink: "/contact",
      image: initialProducts[4]?.image ?? initialProducts[0].image,
      active: true,
    },
  ],
  sectionVisibility: {
    hero: true,
    featuredProducts: true,
    newArrivals: true,
    bestsellers: true,
    categories: true,
    promotions: true,
  },
};

export const initialSettings: SiteSettings = {
  websiteLogo: "AURELIA",
  businessName: "Aurelia Heritage",
  phoneNumber: "+91 99999 99999",
  whatsappNumber: WHATSAPP_NUMBER,
  email: "concierge@aurelia.example",
  address: "12 Zaveri Bazaar, Kalbadevi, Mumbai, Maharashtra 400002",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  youtubeUrl: "https://youtube.com",
  otherLinks: "https://maps.google.com",
  businessInformation: "Luxury jewellery atelier specializing in gold, diamond and bridal commissions.",
};

export const initialAdminUsers: AdminUser[] = [
  {
    id: "admin-001",
    name: "Super Admin",
    email: "admin@luxjewellery.com",
    password: "admin123",
    role: "super-admin",
  },
  {
    id: "admin-002",
    name: "Manager",
    email: "manager@luxjewellery.com",
    password: "manager123",
    role: "manager",
  },
];

export function createInitialSiteData(): SiteData {
  return {
    products: initialProducts,
    categories: initialCategories,
    collections: initialCollections,
    enquiries: initialEnquiries,
    offers: initialOffers,
    homepage: initialHomepage,
    settings: initialSettings,
    stockHistory: [],
    adminUsers: initialAdminUsers,
  };
}

export function deriveProductStatus(product: ProductRecord) {
  if (!product.active) return "inactive" as const;
  if (product.stock <= 0) return "out-of-stock" as const;
  if (product.stock <= product.lowStockLimit) return "low-stock" as const;
  return "in-stock" as const;
}

export function deriveOfferStatus(offer: OfferRecord) {
  if (!offer.active) return "inactive" as const;
  if (offer.expiryDate < iso()) return "expired" as const;
  return "active" as const;
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export function normalizeSelectionIds(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

export function cloneSiteData(data: SiteData): SiteData {
  return {
    ...data,
    products: data.products.map((product) => ({ ...product, images: [...product.images] })),
    categories: data.categories.map((category) => ({ ...category })),
    collections: data.collections.map((collection) => ({ ...collection })),
    enquiries: data.enquiries.map((enquiry) => ({ ...enquiry })),
    offers: data.offers.map((offer) => ({ ...offer, selectionIds: [...offer.selectionIds] })),
    homepage: {
      ...data.homepage,
      heroBanners: data.homepage.heroBanners.map((banner) => ({ ...banner })),
      featuredProductIds: [...data.homepage.featuredProductIds],
      newArrivalIds: [...data.homepage.newArrivalIds],
      bestsellerIds: [...data.homepage.bestsellerIds],
      featuredCategoryIds: [...data.homepage.featuredCategoryIds],
      promotionalBanners: data.homepage.promotionalBanners.map((banner) => ({ ...banner })),
      sectionVisibility: { ...data.homepage.sectionVisibility },
    },
    settings: { ...data.settings },
    stockHistory: data.stockHistory.map((entry) => ({ ...entry })),
    adminUsers: data.adminUsers.map((user) => ({ ...user })),
  };
}
