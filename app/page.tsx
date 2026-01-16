import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import AboutPage from "./about/page";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <FeaturedCollection />
      <AboutPage />
    </main>
  );
}
