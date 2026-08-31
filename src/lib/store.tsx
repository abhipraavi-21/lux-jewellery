import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  cloneSiteData,
  createId,
  deriveOfferStatus,
  deriveProductStatus,
  type AdminUser,
  type CategoryRecord,
  type CollectionRecord,
  type EnquiryRecord,
  type EnquiryStatus,
  type HomepageContent,
  type OfferRecord,
  type ProductRecord,
  type SiteData,
  type SiteSettings,
  type StockHistoryEntry,
} from "./site-data";

type CartItem = { id: string; qty: number };

type Store = {
  hydrated: boolean;
  cart: CartItem[];
  wishlist: string[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleWishlist: (id: string) => void;
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  cartProducts: Array<ProductRecord & { qty: number }>;
  wishlistProducts: ProductRecord[];
  clearCart: () => void;

  siteData: SiteData;
  products: ProductRecord[];
  activeProducts: ProductRecord[];
  categories: CategoryRecord[];
  activeCategories: CategoryRecord[];
  collections: CollectionRecord[];
  activeCollections: CollectionRecord[];
  enquiries: EnquiryRecord[];
  offers: OfferRecord[];
  homepage: HomepageContent;
  settings: SiteSettings;
  stockHistory: StockHistoryEntry[];
  adminUsers: AdminUser[];
  currentAdmin: AdminUser | null;
  currentAdminRole: AdminUser["role"] | null;
  isAuthenticated: boolean;
  loginAdmin: (email: string, password: string, remember?: boolean) => { ok: true; user: AdminUser } | { ok: false; message: string };
  logoutAdmin: () => void;
  changePassword: (currentPassword: string, nextPassword: string) => Promise<{ ok: true } | { ok: false; message: string }>;

  upsertProduct: (product: ProductRecord) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductActive: (id: string) => Promise<void>;
  updateStock: (id: string, change: number, reason: string) => Promise<void>;
  upsertCategory: (category: CategoryRecord) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  upsertCollection: (collection: CollectionRecord) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  updateEnquiry: (id: string, patch: Partial<EnquiryRecord>) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  upsertOffer: (offer: OfferRecord) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  updateHomepage: (patch: Partial<HomepageContent>) => Promise<void>;
  updateSettings: (patch: Partial<SiteSettings>) => Promise<void>;

  recentEnquiries: EnquiryRecord[];
  lowStockProducts: ProductRecord[];
  dashboardMetrics: {
    totalProducts: number;
    totalCategories: number;
    totalEnquiries: number;
    pendingEnquiries: number;
    lowStockProducts: number;
  };
};

const Ctx = createContext<Store | null>(null);

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / private browsing issues.
  }
};

const CART_KEY = "luxe.cart";
const WISHLIST_KEY = "luxe.wishlist";
const ADMIN_KEY = "luxe.admin-session";

const clamp = (value: number, min = 0) => Math.max(min, value);

export function StoreProvider({ children, initialSiteData }: { children: ReactNode; initialSiteData: SiteData }) {
  const [hydrated, setHydrated] = useState(false);
  const [siteData, setSiteData] = useState<SiteData>(() => cloneSiteData(initialSiteData));
  const [cart, setCart] = useState<CartItem[]>(() => []);
  const [wishlist, setWishlist] = useState<string[]>(() => []);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const siteDataRef = useRef(siteData);

  useEffect(() => {
    setCart(readJson(CART_KEY, [] as CartItem[]));
    setWishlist(readJson(WISHLIST_KEY, [] as string[]));
    setCurrentAdmin(readJson(ADMIN_KEY, null as AdminUser | null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    siteDataRef.current = siteData;
  }, [siteData]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson(CART_KEY, cart);
  }, [hydrated, cart]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson(WISHLIST_KEY, wishlist);
  }, [hydrated, wishlist]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson(ADMIN_KEY, currentAdmin);
  }, [hydrated, currentAdmin]);

  const saveSiteData = async (next: SiteData) => {
    siteDataRef.current = next;
    setSiteData(next);

    if (!hydrated) return;

    const response = await fetch("/api/site-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: next }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to persist site data to MySQL.");
    }
  };

  const value = useMemo<Store>(() => {
    const products = siteData.products;
    const categories = siteData.categories;
    const collections = siteData.collections;
    const enquiries = siteData.enquiries;
    const offers = siteData.offers.map((offer) => ({
      ...offer,
      active: deriveOfferStatus(offer) === "active",
    }));
    const homepage = siteData.homepage;
    const settings = siteData.settings;
    const stockHistory = siteData.stockHistory;
    const adminUsers = siteData.adminUsers;

    const findProduct = (id: string) => products.find((product) => product.id === id);
    const cartProducts = cart
      .map((item) => {
        const product = findProduct(item.id);
        return product ? { ...product, qty: item.qty } : null;
      })
      .filter(Boolean) as Array<ProductRecord & { qty: number }>;

    const wishlistProducts = wishlist.map(findProduct).filter(Boolean) as ProductRecord[];
    const activeProducts = products.filter((product) => product.active);
    const activeCategories = categories.filter((category) => category.active);
    const activeCollections = collections.filter((collection) => collection.active);
    const recentEnquiries = [...enquiries].sort((a, b) => b.enquiryDate.localeCompare(a.enquiryDate)).slice(0, 5);
    const lowStockProducts = products.filter((product) => product.active && product.stock <= product.lowStockLimit);

    const updateProducts = (updater: (next: ProductRecord[]) => ProductRecord[]) => {
      return saveSiteData({
        ...siteDataRef.current,
        products: updater(siteDataRef.current.products),
      });
    };
    const updateCategories = (updater: (next: CategoryRecord[]) => CategoryRecord[]) => {
      return saveSiteData({
        ...siteDataRef.current,
        categories: updater(siteDataRef.current.categories),
      });
    };
    const updateCollections = (updater: (next: CollectionRecord[]) => CollectionRecord[]) => {
      return saveSiteData({
        ...siteDataRef.current,
        collections: updater(siteDataRef.current.collections),
      });
    };
    const updateEnquiries = (updater: (next: EnquiryRecord[]) => EnquiryRecord[]) => {
      return saveSiteData({
        ...siteDataRef.current,
        enquiries: updater(siteDataRef.current.enquiries),
      });
    };
    const updateOffers = (updater: (next: OfferRecord[]) => OfferRecord[]) => {
      return saveSiteData({
        ...siteDataRef.current,
        offers: updater(siteDataRef.current.offers),
      });
    };
    const updateHomepagePatch = (patch: Partial<HomepageContent>) => {
      return saveSiteData({
        ...siteDataRef.current,
        homepage: { ...siteDataRef.current.homepage, ...patch },
      });
    };
    const updateSettingsPatch = (patch: Partial<SiteSettings>) => {
      return saveSiteData({
        ...siteDataRef.current,
        settings: { ...siteDataRef.current.settings, ...patch },
      });
    };

    return {
      hydrated,
      cart,
      wishlist,
      addToCart: (id, qty = 1) =>
        setCart((current) => {
          const index = current.findIndex((item) => item.id === id);
          if (index >= 0) {
            const next = [...current];
            next[index] = { id, qty: next[index].qty + qty };
            return next;
          }
          return [...current, { id, qty }];
        }),
      removeFromCart: (id) => setCart((current) => current.filter((item) => item.id !== id)),
      updateQty: (id, qty) =>
        setCart((current) =>
          current
            .map((item) => (item.id === id ? { ...item, qty: clamp(qty, 1) } : item))
            .filter((item) => item.qty > 0),
        ),
      toggleWishlist: (id) =>
        setWishlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id])),
      cartCount: cart.reduce((sum, item) => sum + item.qty, 0),
      wishlistCount: wishlist.length,
      cartTotal: cartProducts.reduce((sum, product) => sum + product.price * product.qty, 0),
      cartProducts,
      wishlistProducts,
      clearCart: () => setCart([]),

      siteData,
      products,
      activeProducts,
      categories,
      activeCategories,
      collections,
      activeCollections,
      enquiries,
      offers,
      homepage,
      settings,
      stockHistory,
      adminUsers,
      currentAdmin,
      currentAdminRole: currentAdmin?.role ?? null,
      isAuthenticated: Boolean(currentAdmin),
      loginAdmin: (email, password, remember = true) => {
        const user = adminUsers.find(
          (candidate) => candidate.email.toLowerCase() === email.toLowerCase().trim() && candidate.password === password,
        );
        if (!user) return { ok: false, message: "Invalid email or password." };
        const session = { ...user, remember };
        setCurrentAdmin(session);
        writeJson(ADMIN_KEY, session);
        return { ok: true, user: session };
      },
      logoutAdmin: () => {
        setCurrentAdmin(null);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(ADMIN_KEY);
          window.sessionStorage.removeItem(ADMIN_KEY);
        }
      },
      changePassword: (currentPassword, nextPassword) => {
        if (!currentAdmin) return { ok: false, message: "No active admin session." };
        const user = adminUsers.find((candidate) => candidate.id === currentAdmin.id);
        if (!user || user.password !== currentPassword) {
          return { ok: false, message: "Current password is incorrect." };
        }
        if (nextPassword.length < 6) {
          return { ok: false, message: "Password must be at least 6 characters." };
        }
        setCurrentAdmin((candidate) => (candidate ? { ...candidate } : candidate));
        return saveSiteData({
          ...siteDataRef.current,
          adminUsers: siteDataRef.current.adminUsers.map((candidate) =>
            candidate.id === currentAdmin.id ? { ...candidate, password: nextPassword } : candidate,
          ),
        }).then(() => ({ ok: true }));
      },

      upsertProduct: (product) => {
        return updateProducts((next) => {
          const index = next.findIndex((item) => item.id === product.id);
          if (index >= 0) {
            const copy = [...next];
            copy[index] = product;
            return copy;
          }
          return [product, ...next];
        });
      },
      deleteProduct: (id) => {
        setWishlist((next) => next.filter((item) => item !== id));
        setCart((next) => next.filter((item) => item.id !== id));
        return saveSiteData({
          ...siteDataRef.current,
          products: siteDataRef.current.products.filter((product) => product.id !== id),
          homepage: {
            ...siteDataRef.current.homepage,
            featuredProductIds: siteDataRef.current.homepage.featuredProductIds.filter((item) => item !== id),
            newArrivalIds: siteDataRef.current.homepage.newArrivalIds.filter((item) => item !== id),
            bestsellerIds: siteDataRef.current.homepage.bestsellerIds.filter((item) => item !== id),
          },
        });
      },
      toggleProductActive: (id) => {
        return updateProducts((next) => next.map((product) => (product.id === id ? { ...product, active: !product.active } : product)));
      },
      updateStock: (id, change, reason) => {
        const previous = siteDataRef.current.products.find((product) => product.id === id);
        if (!previous) return;

        const updatedStock = clamp(previous.stock + change, 0);
        const entry: StockHistoryEntry = {
          id: createId("stock"),
          productId: id,
          date: new Date().toISOString(),
          previousStock: previous.stock,
          quantityChanged: change,
          updatedStock,
          reason: reason.trim() || "Manual stock update",
        };

        return saveSiteData({
          ...siteDataRef.current,
          products: siteDataRef.current.products.map((product) => (product.id === id ? { ...product, stock: updatedStock } : product)),
          stockHistory: [entry, ...siteDataRef.current.stockHistory],
        });
      },
      upsertCategory: (category) => {
        return updateCategories((next) => {
          const index = next.findIndex((item) => item.id === category.id);
          if (index >= 0) {
            const copy = [...next];
            copy[index] = category;
            return copy;
          }
          return [category, ...next];
        });
      },
      deleteCategory: (id) => {
        const categoryName = categories.find((category) => category.id === id)?.name ?? "";
        const fallback = categories.find((category) => category.id !== id)?.name ?? "";
        return saveSiteData({
          ...siteDataRef.current,
          categories: siteDataRef.current.categories.filter((category) => category.id !== id),
          products: siteDataRef.current.products.map((product) =>
            product.category === categoryName ? { ...product, category: fallback } : product,
          ),
        });
      },
      upsertCollection: (collection) => {
        return updateCollections((next) => {
          const index = next.findIndex((item) => item.id === collection.id);
          if (index >= 0) {
            const copy = [...next];
            copy[index] = collection;
            return copy;
          }
          return [collection, ...next];
        });
      },
      deleteCollection: (id) => {
        const collectionName = collections.find((collection) => collection.id === id)?.name ?? "";
        const fallback = collections.find((collection) => collection.id !== id)?.name ?? "";
        return saveSiteData({
          ...siteDataRef.current,
          collections: siteDataRef.current.collections.filter((collection) => collection.id !== id),
          products: siteDataRef.current.products.map((product) =>
            product.collection === collectionName ? { ...product, collection: fallback } : product,
          ),
        });
      },
      updateEnquiry: (id, patch) => {
        return updateEnquiries((next) => next.map((enquiry) => (enquiry.id === id ? { ...enquiry, ...patch } : enquiry)));
      },
      deleteEnquiry: (id) => {
        return updateEnquiries((next) => next.filter((enquiry) => enquiry.id !== id));
      },
      upsertOffer: (offer) => {
        return updateOffers((next) => {
          const index = next.findIndex((item) => item.id === offer.id);
          if (index >= 0) {
            const copy = [...next];
            copy[index] = offer;
            return copy;
          }
          return [offer, ...next];
        });
      },
      deleteOffer: (id) => {
        return updateOffers((next) => next.filter((offer) => offer.id !== id));
      },
      updateHomepage: updateHomepagePatch,
      updateSettings: updateSettingsPatch,

      recentEnquiries,
      lowStockProducts,
      dashboardMetrics: {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalEnquiries: enquiries.length,
        pendingEnquiries: enquiries.filter((enquiry) => enquiry.status === "new").length,
        lowStockProducts: lowStockProducts.length,
      },
    };
  }, [siteData, cart, wishlist, currentAdmin, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const value = useContext(Ctx);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const getInventoryStatus = (product: ProductRecord) => deriveProductStatus(product);
export const getOfferStatus = (offer: OfferRecord) => deriveOfferStatus(offer);
