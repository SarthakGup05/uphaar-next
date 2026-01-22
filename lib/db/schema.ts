import { pgTable, serial, text, integer, timestamp, numeric, boolean } from "drizzle-orm/pg-core";

// ----------------------------------------------------------------------
// 1. STORE CONTENT
// ----------------------------------------------------------------------

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "Resin", "Candles", etc.
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  image: text("image").notNull(),
  heroImage: text("hero_image"), // Optional hero/banner image
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"), // WhatsApp number
  status: text("status").notNull().default("Pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  itemsSummary: text("items_summary"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ----------------------------------------------------------------------
// 2. AUTHENTICATION
// ----------------------------------------------------------------------

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Store HASHED password here (e.g. bcrypt)
  role: text("role").notNull().default("user"), // 'admin' or 'user'
  createdAt: timestamp("created_at").defaultNow(),
});

// Optional: If you plan to use Session-based auth (recommended for Admin panels)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Delete session if user is deleted
  expiresAt: timestamp("expires_at").notNull(),
});

// ----------------------------------------------------------------------
// 3. CONTENT MANAGEMENT
// ----------------------------------------------------------------------

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  image: text("image").notNull(),
  cta: text("cta").default("Shop Now"),
  align: text("align").default("center"), // 'left', 'center', 'right'
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ----------------------------------------------------------------------
// 4. COUPONS
// ----------------------------------------------------------------------

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // e.g., "SAVE10"
  discountType: text("discount_type").notNull(), // 'PERCENTAGE' or 'FIXED'
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderValue: numeric("min_order_value", { precision: 10, scale: 2 }).default("0"),
  maxDiscount: numeric("max_discount", { precision: 10, scale: 2 }), // Max discount for percentage coupons
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  isActive: boolean("is_active").default(true),
  usageLimit: integer("usage_limit"), // Total times this coupon can be used
  usedCount: integer("used_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const couponProducts = pgTable("coupon_products", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id")
    .notNull()
    .references(() => coupons.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});