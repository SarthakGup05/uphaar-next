import { config } from "dotenv";
import { heroSlides } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

// Load environment variables
config({ path: ".env" });

async function main() {
  console.log("🌱 Seeding hero slides...");

  const { db } = await import("@/lib/db");

  const slides = [
    {
      title: "Handcrafted Resin Art",
      subtitle: "Capture your precious memories in timeless resin masterpieces.",
      image: "https://images.unsplash.com/photo-1615166292150-52960037eb87?q=80&w=2670&auto=format&fit=crop",
      cta: "Shop Resin Art",
      align: "left",
      order: 1,
      isActive: true,
    },
    {
      title: "Custom Nameplates",
      subtitle: "Personalize your entrance with our elegant and durable nameplates.",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2670&auto=format&fit=crop",
      cta: "Explore Collection",
      align: "center",
      order: 2,
      isActive: true,
    },
    {
      title: "Premium Gift Hampers",
      subtitle: "Curated hampers for every occasion, wrapped with love.",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2640&auto=format&fit=crop",
      cta: "View Hampers",
      align: "right",
      order: 3,
      isActive: true,
    },
    {
        title: "Wedding Essentials",
        subtitle: "Make your special day even more memorable with our wedding collection.",
        image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2670&auto=format&fit=crop",
        cta: "Shop Wedding",
        align: "center",
        order: 4,
        isActive: true,
      },
  ];

  try {
    // Clear existing slides (optional, but good for idempotent seeding)
    // await db.delete(heroSlides); 
    // Commented out to avoid accidental data loss if user wants to keep existing.
    // Given the request is "seed some data", append is usually safer or just run.
    
    await db.insert(heroSlides).values(slides);
    console.log("✅ Hero slides seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding hero slides:", error);
  }

  process.exit(0);
}

main();
