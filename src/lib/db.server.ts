import mysql, { type Pool, type PoolConnection, type RowDataPacket } from "mysql2/promise";

import { getServerConfig } from "./config.server";
import {
  cloneSiteData,
  createInitialSiteData,
  type AdminUser,
  type CategoryRecord,
  type CollectionRecord,
  type EnquiryRecord,
  type HomepageContent,
  type OfferRecord,
  type ProductRecord,
  type SiteData,
  type SiteSettings,
  type StockHistoryEntry,
} from "./site-data";

const SITE_DATA_ID = "main";

const TABLES = {
  legacy: "site_data",
  products: "products",
  categories: "categories",
  collections: "collections",
  enquiries: "enquiries",
  offers: "offers",
  homepage: "homepage",
  settings: "settings",
  stockHistory: "stock_history",
  adminUsers: "admin_users",
} as const;

type LegacySiteDataRow = RowDataPacket & { payload: string };
type CountRow = RowDataPacket & { count: number };

type ProductRow = RowDataPacket & {
  id: string;
  sort_order: number;
  name: string;
  sku: string;
  category: string;
  collection: string;
  material: string;
  purity: string;
  occasion: string;
  price: string | number;
  mrp: string | number;
  rating: string | number;
  image: string;
  images: string;
  description: string;
  weight: string;
  stone: string;
  badge: string | null;
  stock: number;
  low_stock_limit: number;
  active: number;
  featured: number;
  bestseller: number;
  new_arrival: number;
};

type CategoryRow = RowDataPacket & {
  id: string;
  sort_order: number;
  name: string;
  image: string;
  description: string;
  active: number;
};

type CollectionRow = RowDataPacket & {
  id: string;
  sort_order: number;
  name: string;
  image: string;
  description: string;
  active: number;
  featured: number;
};

type EnquiryRow = RowDataPacket & {
  id: string;
  sort_order: number;
  customer_name: string;
  phone: string;
  email: string;
  requirement: string;
  budget: string;
  message: string;
  enquiry_date: string;
  status: string;
  admin_notes: string;
};

type OfferRow = RowDataPacket & {
  id: string;
  sort_order: number;
  offer_name: string;
  coupon_code: string;
  discount_percentage: number;
  start_date: string;
  expiry_date: string;
  apply_to: "all" | "product" | "category";
  selection_ids: string;
  active: number;
};

type HomepageRow = RowDataPacket & {
  id: string;
  hero_banners: string;
  featured_product_ids: string;
  new_arrival_ids: string;
  bestseller_ids: string;
  featured_category_ids: string;
  promotional_banners: string;
  section_visibility: string;
};

type SettingsRow = RowDataPacket & {
  id: string;
  website_logo: string;
  business_name: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  other_links: string;
  business_information: string;
};

type StockHistoryRow = RowDataPacket & {
  id: string;
  sort_order: number;
  product_id: string;
  entry_date: string;
  previous_stock: number;
  quantity_changed: number;
  updated_stock: number;
  reason: string;
};

type AdminUserRow = RowDataPacket & {
  id: string;
  sort_order: number;
  name: string;
  email: string;
  password: string;
  role: string;
  remember: number;
};

let pool: Pool | undefined;
let schemaReady = false;

function getDatabaseUrl() {
  const { databaseUrl } = getServerConfig();
  if (!databaseUrl) {
    throw new Error(
      "Missing MySQL configuration. Set DATABASE_URL or MYSQL_HOST / MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE.",
    );
  }
  return databaseUrl;
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDatabaseUrl());
  }
  return pool;
}

const boolToInt = (value: boolean) => (value ? 1 : 0);
const intToBool = (value: unknown) => Number(value) === 1;

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (Buffer.isBuffer(value)) {
    try {
      return JSON.parse(value.toString("utf8")) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function normalizeSiteData(data: SiteData): SiteData {
  return cloneSiteData(data);
}

async function ensureSchema() {
  if (schemaReady) return;

  const db = getPool();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.legacy}\` (
      id VARCHAR(32) NOT NULL PRIMARY KEY,
      payload LONGTEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.products}\` (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      sort_order INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      sku VARCHAR(255) NOT NULL UNIQUE,
      category VARCHAR(255) NOT NULL,
      collection VARCHAR(255) NOT NULL,
      material VARCHAR(255) NOT NULL,
      purity VARCHAR(255) NOT NULL,
      occasion VARCHAR(255) NOT NULL,
      price DECIMAL(12,2) NOT NULL,
      mrp DECIMAL(12,2) NOT NULL,
      rating DECIMAL(4,2) NOT NULL,
      image LONGTEXT NOT NULL,
      images JSON NOT NULL,
      description LONGTEXT NOT NULL,
      weight VARCHAR(255) NOT NULL,
      stone VARCHAR(255) NOT NULL,
      badge VARCHAR(255) DEFAULT NULL,
      stock INT NOT NULL,
      low_stock_limit INT NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      featured TINYINT(1) NOT NULL DEFAULT 0,
      bestseller TINYINT(1) NOT NULL DEFAULT 0,
      new_arrival TINYINT(1) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.categories}\` (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      sort_order INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      image LONGTEXT NOT NULL,
      description LONGTEXT NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.collections}\` (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      sort_order INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      image LONGTEXT NOT NULL,
      description LONGTEXT NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      featured TINYINT(1) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.enquiries}\` (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      sort_order INT NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      phone VARCHAR(64) NOT NULL,
      email VARCHAR(255) NOT NULL,
      requirement VARCHAR(255) NOT NULL,
      budget VARCHAR(64) NOT NULL,
      message LONGTEXT NOT NULL,
      enquiry_date DATE NOT NULL,
      status VARCHAR(32) NOT NULL,
      admin_notes LONGTEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.offers}\` (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      sort_order INT NOT NULL,
      offer_name VARCHAR(255) NOT NULL,
      coupon_code VARCHAR(255) NOT NULL,
      discount_percentage INT NOT NULL,
      start_date DATE NOT NULL,
      expiry_date DATE NOT NULL,
      apply_to VARCHAR(32) NOT NULL,
      selection_ids JSON NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.homepage}\` (
      id VARCHAR(32) NOT NULL PRIMARY KEY,
      hero_banners JSON NOT NULL,
      featured_product_ids JSON NOT NULL,
      new_arrival_ids JSON NOT NULL,
      bestseller_ids JSON NOT NULL,
      featured_category_ids JSON NOT NULL,
      promotional_banners JSON NOT NULL,
      section_visibility JSON NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.settings}\` (
      id VARCHAR(32) NOT NULL PRIMARY KEY,
      website_logo VARCHAR(255) NOT NULL,
      business_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(64) NOT NULL,
      whatsapp_number VARCHAR(64) NOT NULL,
      email VARCHAR(255) NOT NULL,
      address LONGTEXT NOT NULL,
      facebook_url LONGTEXT NOT NULL,
      instagram_url LONGTEXT NOT NULL,
      youtube_url LONGTEXT NOT NULL,
      other_links LONGTEXT NOT NULL,
      business_information LONGTEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.stockHistory}\` (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      sort_order INT NOT NULL,
      product_id VARCHAR(64) NOT NULL,
      entry_date DATETIME NOT NULL,
      previous_stock INT NOT NULL,
      quantity_changed INT NOT NULL,
      updated_stock INT NOT NULL,
      reason LONGTEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS \`${TABLES.adminUsers}\` (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      sort_order INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(64) NOT NULL,
      remember TINYINT(1) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_admin_email (email)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  schemaReady = true;
}

async function countRows(tableName: string) {
  const db = getPool();
  const [rows] = (await db.query(`SELECT COUNT(*) AS count FROM \`${tableName}\``)) as [CountRow[], unknown];
  return Number(rows[0]?.count ?? 0);
}

async function loadLegacySnapshot(): Promise<SiteData | null> {
  const db = getPool();
  const [rows] = (await db.query(
    `SELECT payload FROM \`${TABLES.legacy}\` WHERE id = ? LIMIT 1`,
    [SITE_DATA_ID],
  )) as [LegacySiteDataRow[], unknown];

  if (!rows.length) return null;
  return normalizeSiteData(JSON.parse(rows[0].payload) as SiteData);
}

async function saveLegacySnapshot(connection: PoolConnection, data: SiteData) {
  await connection.execute(
    `
      INSERT INTO \`${TABLES.legacy}\` (id, payload)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE payload = VALUES(payload)
    `,
    [SITE_DATA_ID, JSON.stringify(data)],
  );
}

async function clearNormalizedTables(connection: PoolConnection) {
  await connection.execute(`DELETE FROM \`${TABLES.stockHistory}\``);
  await connection.execute(`DELETE FROM \`${TABLES.adminUsers}\``);
  await connection.execute(`DELETE FROM \`${TABLES.offers}\``);
  await connection.execute(`DELETE FROM \`${TABLES.enquiries}\``);
  await connection.execute(`DELETE FROM \`${TABLES.collections}\``);
  await connection.execute(`DELETE FROM \`${TABLES.categories}\``);
  await connection.execute(`DELETE FROM \`${TABLES.products}\``);
  await connection.execute(`DELETE FROM \`${TABLES.homepage}\``);
  await connection.execute(`DELETE FROM \`${TABLES.settings}\``);
}

async function insertProducts(connection: PoolConnection, products: ProductRecord[]) {
  for (const [index, product] of products.entries()) {
    await connection.execute(
      `
        INSERT INTO \`${TABLES.products}\`
          (id, sort_order, name, sku, category, collection, material, purity, occasion, price, mrp, rating, image, images, description, weight, stone, badge, stock, low_stock_limit, active, featured, bestseller, new_arrival)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        product.id,
        index,
        product.name,
        product.sku,
        product.category,
        product.collection,
        product.material,
        product.purity,
        product.occasion,
        product.price,
        product.mrp,
        product.rating,
        product.image,
        JSON.stringify(product.images),
        product.description,
        product.weight,
        product.stone,
        product.badge ?? null,
        product.stock,
        product.lowStockLimit,
        boolToInt(product.active),
        boolToInt(product.featured),
        boolToInt(product.bestseller),
        boolToInt(product.newArrival),
      ],
    );
  }
}

async function insertCategories(connection: PoolConnection, categories: CategoryRecord[]) {
  for (const [index, category] of categories.entries()) {
    await connection.execute(
      `
        INSERT INTO \`${TABLES.categories}\`
          (id, sort_order, name, image, description, active)
        VALUES
          (?, ?, ?, ?, ?, ?)
      `,
      [category.id, index, category.name, category.image, category.description, boolToInt(category.active)],
    );
  }
}

async function insertCollections(connection: PoolConnection, collections: CollectionRecord[]) {
  for (const [index, collection] of collections.entries()) {
    await connection.execute(
      `
        INSERT INTO \`${TABLES.collections}\`
          (id, sort_order, name, image, description, active, featured)
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        collection.id,
        index,
        collection.name,
        collection.image,
        collection.description,
        boolToInt(collection.active),
        boolToInt(collection.featured),
      ],
    );
  }
}

async function insertEnquiries(connection: PoolConnection, enquiries: EnquiryRecord[]) {
  for (const [index, enquiry] of enquiries.entries()) {
    await connection.execute(
      `
        INSERT INTO \`${TABLES.enquiries}\`
          (id, sort_order, customer_name, phone, email, requirement, budget, message, enquiry_date, status, admin_notes)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        enquiry.id,
        index,
        enquiry.customerName,
        enquiry.phone,
        enquiry.email,
        enquiry.requirement,
        enquiry.budget,
        enquiry.message,
        enquiry.enquiryDate,
        enquiry.status,
        enquiry.adminNotes,
      ],
    );
  }
}

async function insertOffers(connection: PoolConnection, offers: OfferRecord[]) {
  for (const [index, offer] of offers.entries()) {
    await connection.execute(
      `
        INSERT INTO \`${TABLES.offers}\`
          (id, sort_order, offer_name, coupon_code, discount_percentage, start_date, expiry_date, apply_to, selection_ids, active)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        offer.id,
        index,
        offer.offerName,
        offer.couponCode,
        offer.discountPercentage,
        offer.startDate,
        offer.expiryDate,
        offer.applyTo,
        JSON.stringify(offer.selectionIds),
        boolToInt(offer.active),
      ],
    );
  }
}

async function insertHomepage(connection: PoolConnection, homepage: HomepageContent) {
  await connection.execute(
    `
      INSERT INTO \`${TABLES.homepage}\`
        (id, hero_banners, featured_product_ids, new_arrival_ids, bestseller_ids, featured_category_ids, promotional_banners, section_visibility)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      SITE_DATA_ID,
      JSON.stringify(homepage.heroBanners),
      JSON.stringify(homepage.featuredProductIds),
      JSON.stringify(homepage.newArrivalIds),
      JSON.stringify(homepage.bestsellerIds),
      JSON.stringify(homepage.featuredCategoryIds),
      JSON.stringify(homepage.promotionalBanners),
      JSON.stringify(homepage.sectionVisibility),
    ],
  );
}

async function insertSettings(connection: PoolConnection, settings: SiteSettings) {
  await connection.execute(
    `
      INSERT INTO \`${TABLES.settings}\`
        (id, website_logo, business_name, phone_number, whatsapp_number, email, address, facebook_url, instagram_url, youtube_url, other_links, business_information)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      SITE_DATA_ID,
      settings.websiteLogo,
      settings.businessName,
      settings.phoneNumber,
      settings.whatsappNumber,
      settings.email,
      settings.address,
      settings.facebookUrl,
      settings.instagramUrl,
      settings.youtubeUrl,
      settings.otherLinks,
      settings.businessInformation,
    ],
  );
}

async function insertStockHistory(connection: PoolConnection, entries: StockHistoryEntry[]) {
  for (const [index, entry] of entries.entries()) {
    await connection.execute(
      `
        INSERT INTO \`${TABLES.stockHistory}\`
          (id, sort_order, product_id, entry_date, previous_stock, quantity_changed, updated_stock, reason)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        entry.id,
        index,
        entry.productId,
        entry.date,
        entry.previousStock,
        entry.quantityChanged,
        entry.updatedStock,
        entry.reason,
      ],
    );
  }
}

async function insertAdminUsers(connection: PoolConnection, adminUsers: AdminUser[]) {
  for (const [index, user] of adminUsers.entries()) {
    await connection.execute(
      `
        INSERT INTO \`${TABLES.adminUsers}\`
          (id, sort_order, name, email, password, role, remember)
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
      `,
      [user.id, index, user.name, user.email, user.password, user.role, boolToInt(Boolean(user.remember))],
    );
  }
}

async function saveNormalizedTables(data: SiteData) {
  const db = getPool();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await clearNormalizedTables(connection);
    await insertProducts(connection, data.products);
    await insertCategories(connection, data.categories);
    await insertCollections(connection, data.collections);
    await insertEnquiries(connection, data.enquiries);
    await insertOffers(connection, data.offers);
    await insertHomepage(connection, data.homepage);
    await insertSettings(connection, data.settings);
    await insertStockHistory(connection, data.stockHistory);
    await insertAdminUsers(connection, data.adminUsers);
    await saveLegacySnapshot(connection, data);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function loadNormalizedSiteData(): Promise<SiteData> {
  const db = getPool();

  const [productRows] = (await db.query(
    `SELECT * FROM \`${TABLES.products}\` ORDER BY sort_order ASC, updated_at ASC`,
  )) as [ProductRow[], unknown];

  if (!productRows.length) {
    return cloneSiteData(createInitialSiteData());
  }

  const [categoryRows] = (await db.query(
    `SELECT * FROM \`${TABLES.categories}\` ORDER BY sort_order ASC, updated_at ASC`,
  )) as [CategoryRow[], unknown];
  const [collectionRows] = (await db.query(
    `SELECT * FROM \`${TABLES.collections}\` ORDER BY sort_order ASC, updated_at ASC`,
  )) as [CollectionRow[], unknown];
  const [enquiryRows] = (await db.query(
    `SELECT * FROM \`${TABLES.enquiries}\` ORDER BY sort_order ASC, updated_at ASC`,
  )) as [EnquiryRow[], unknown];
  const [offerRows] = (await db.query(
    `SELECT * FROM \`${TABLES.offers}\` ORDER BY sort_order ASC, updated_at ASC`,
  )) as [OfferRow[], unknown];
  const [homepageRows] = (await db.query(`SELECT * FROM \`${TABLES.homepage}\` WHERE id = ? LIMIT 1`, [
    SITE_DATA_ID,
  ])) as [HomepageRow[], unknown];
  const [settingsRows] = (await db.query(`SELECT * FROM \`${TABLES.settings}\` WHERE id = ? LIMIT 1`, [
    SITE_DATA_ID,
  ])) as [SettingsRow[], unknown];
  const [stockHistoryRows] = (await db.query(
    `SELECT * FROM \`${TABLES.stockHistory}\` ORDER BY sort_order ASC, updated_at DESC`,
  )) as [StockHistoryRow[], unknown];
  const [adminRows] = (await db.query(
    `SELECT * FROM \`${TABLES.adminUsers}\` ORDER BY sort_order ASC, updated_at ASC`,
  )) as [AdminUserRow[], unknown];

  const homepage = homepageRows[0];
  const settings = settingsRows[0];

  if (!homepage || !settings) {
    return cloneSiteData(createInitialSiteData());
  }

  return cloneSiteData({
    products: productRows.map((row) => ({
      id: row.id,
      name: row.name,
      sku: row.sku,
      category: row.category,
      collection: row.collection,
      material: row.material,
      purity: row.purity,
      occasion: row.occasion,
      price: Number(row.price),
      mrp: Number(row.mrp),
      rating: Number(row.rating),
      image: row.image,
      images: parseJson<string[]>(row.images, []),
      description: row.description,
      weight: row.weight,
      stone: row.stone,
      badge: row.badge ?? undefined,
      stock: row.stock,
      lowStockLimit: row.low_stock_limit,
      active: intToBool(row.active),
      featured: intToBool(row.featured),
      bestseller: intToBool(row.bestseller),
      newArrival: intToBool(row.new_arrival),
    })),
    categories: categoryRows.map((row) => ({
      id: row.id,
      name: row.name,
      image: row.image,
      description: row.description,
      active: intToBool(row.active),
    })),
    collections: collectionRows.map((row) => ({
      id: row.id,
      name: row.name,
      image: row.image,
      description: row.description,
      active: intToBool(row.active),
      featured: intToBool(row.featured),
    })),
    enquiries: enquiryRows.map((row) => ({
      id: row.id,
      customerName: row.customer_name,
      phone: row.phone,
      email: row.email,
      requirement: row.requirement,
      budget: row.budget,
      message: row.message,
      enquiryDate: row.enquiry_date,
      status: row.status as SiteData["enquiries"][number]["status"],
      adminNotes: row.admin_notes,
    })),
    offers: offerRows.map((row) => ({
      id: row.id,
      offerName: row.offer_name,
      couponCode: row.coupon_code,
      discountPercentage: row.discount_percentage,
      startDate: row.start_date,
      expiryDate: row.expiry_date,
      applyTo: row.apply_to,
      selectionIds: parseJson<string[]>(row.selection_ids, []),
      active: intToBool(row.active),
    })),
    homepage: {
      heroBanners: parseJson<HomepageContent["heroBanners"]>(homepage.hero_banners, []),
      featuredProductIds: parseJson<string[]>(homepage.featured_product_ids, []),
      newArrivalIds: parseJson<string[]>(homepage.new_arrival_ids, []),
      bestsellerIds: parseJson<string[]>(homepage.bestseller_ids, []),
      featuredCategoryIds: parseJson<string[]>(homepage.featured_category_ids, []),
      promotionalBanners: parseJson<HomepageContent["promotionalBanners"]>(homepage.promotional_banners, []),
      sectionVisibility: parseJson<HomepageContent["sectionVisibility"]>(homepage.section_visibility, {
        hero: true,
        featuredProducts: true,
        newArrivals: true,
        bestsellers: true,
        categories: true,
        promotions: true,
      }),
    },
    settings: {
      websiteLogo: settings.website_logo,
      businessName: settings.business_name,
      phoneNumber: settings.phone_number,
      whatsappNumber: settings.whatsapp_number,
      email: settings.email,
      address: settings.address,
      facebookUrl: settings.facebook_url,
      instagramUrl: settings.instagram_url,
      youtubeUrl: settings.youtube_url,
      otherLinks: settings.other_links,
      businessInformation: settings.business_information,
    },
    stockHistory: stockHistoryRows.map((row) => ({
      id: row.id,
      productId: row.product_id,
      date: row.entry_date,
      previousStock: row.previous_stock,
      quantityChanged: row.quantity_changed,
      updatedStock: row.updated_stock,
      reason: row.reason,
    })),
    adminUsers: adminRows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      role: row.role as AdminUser["role"],
      remember: intToBool(row.remember),
    })),
  });
}

export async function loadSiteDataFromDatabase(): Promise<SiteData> {
  try {
    await ensureSchema();

    const productsCount = await countRows(TABLES.products);
    if (productsCount > 0) {
      return await loadNormalizedSiteData();
    }

    const legacy = await loadLegacySnapshot();
    if (legacy) {
      await saveSiteDataToDatabase(legacy);
      return cloneSiteData(legacy);
    }

    const seed = cloneSiteData(createInitialSiteData());
    await saveSiteDataToDatabase(seed);
    return seed;
  } catch (error) {
    console.error("Failed to load site data from MySQL. Falling back to seed data.", error);
    return cloneSiteData(createInitialSiteData());
  }
}

export async function saveSiteDataToDatabase(data: SiteData) {
  await ensureSchema();
  await saveNormalizedTables(normalizeSiteData(data));
}
