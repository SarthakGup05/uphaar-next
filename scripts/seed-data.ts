import { config } from "dotenv";
import { products, orders } from "@/lib/db/schema";

// 1. Load environment variables
config({ path: ".env" });

const SAMPLE_PRODUCTS = [
  {
    title: "Ocean Blue Resin Tray",
    slug: "ocean-blue-resin-tray",
    description: "Handcrafted resin tray with real sand and shells. Perfect for serving or display.",
    category: "Resin",
    price: "1200",
    stock: 5,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Lavender Soy Candle",
    slug: "lavender-soy-candle",
    description: "Organic soy wax candle with calming lavender essential oils. 40 hour burn time.",
    category: "Candles",
    price: "850",
    stock: 20,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Geometric Concrete Planter",
    slug: "geometric-concrete-planter",
    description: "Minimalist concrete planter with drainage hole. Ideal for succulents.",
    category: "Concrete",
    price: "450",
    stock: 12,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Gold Flake Coaster Set",
    slug: "gold-flake-coaster-set",
    description: "Set of 4 resin coasters with gold leaf detailing. Heat resistant.",
    category: "Resin",
    price: "600",
    stock: 8,
    image: "https://images.unsplash.com/photo-1615485925763-867862f80d52?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Rose & Sandalwood Candle",
    slug: "rose-sandalwood-candle",
    description: "Luxury scent blend in a matte black glass jar.",
    category: "Candles",
    price: "900",
    stock: 15,
    image: "https://images.unsplash.com/photo-1596436081179-8b277b089c25?auto=format&fit=crop&q=80&w=600",
  }
];

const SAMPLE_ORDERS = [
  {
    customerName: "Aditi Sharma",
    customerPhone: "9876543210",
    status: "Paid",
    totalAmount: "2400",
    itemsSummary: "2x Ocean Tray",
    createdAt: new Date("2024-01-10"),
  },
  {
    customerName: "Rahul Verma",
    customerPhone: "9123456789",
    status: "Pending",
    totalAmount: "850",
    itemsSummary: "1x Lavender Candle",
    createdAt: new Date("2024-01-12"),
  },
  {
    customerName: "Sneha Gupta",
    customerPhone: "8887776665",
    status: "Delivered",
    totalAmount: "1800",
    itemsSummary: "3x Coaster Set",
    createdAt: new Date("2023-12-25"),
  },
  {
    customerName: "Vikram Singh",
    customerPhone: "7776665554",
    status: "Shipped",
    totalAmount: "450",
    itemsSummary: "1x Concrete Planter",
    createdAt: new Date("2024-01-14"),
  }
];

async function main() {
  console.log("🌱 Starting seed process...");

  // Dynamic import to ensure env vars are loaded first
  const { db } = await import("@/lib/db");

  try {
    console.log("📦 Seeding Products...");
    // Insert products
    await db.insert(products).values(SAMPLE_PRODUCTS);
    
    console.log("📝 Seeding Orders...");
    // Insert orders
    await db.insert(orders).values(SAMPLE_ORDERS);

    console.log("✅ Database populated successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }

  process.exit(0);
}

main();