import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import AboutPage from "./about/page";
import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export default async function Home() {
  const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.order));

  // Transform to match Slide interface if needed, or ensure DB schema matches
  const formattedSlides = slides.map(slide => ({
    ...slide,
    align: slide.align as "left" | "center" | "right",
    subtitle: slide.subtitle || "",
    cta: slide.cta || "",
    order: slide.order || 0
  }));

  return (
    <main>
      <Hero initialSlides={formattedSlides} />
      <CategoryGrid />
      <FeaturedCollection />
      <AboutPage />
    </main>
  );
}
