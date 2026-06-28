import { HeroBanner } from "@/components/home/HeroBanner";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { NewArrivals } from "@/components/home/NewArrivals";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BestSellers } from "@/components/home/BestSellers";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";
import { getBanners } from "@/lib/actions/banner-actions";
import { getCategories } from "@/lib/actions/category-actions";

// Render on every request so newly added/edited products appear immediately.
// (Also avoids ISR-write usage from time-based static regeneration.)
export const dynamic = "force-dynamic";

export default async function Home() {
  const heroBanners = await getBanners("HERO");
  const promoBanners = await getBanners("PROMO");
  const newsletterBanners = await getBanners("NEWSLETTER");
  const dbCategories = await getCategories();
  
  // Use the first active promo banner for the section
  const activePromo = promoBanners.length > 0 ? promoBanners[0] : null;

  // Use the first active newsletter banner
  const activeNewsletter = newsletterBanners.length > 0 ? newsletterBanners[0] : null;

  return (
    <div className="flex flex-col">
      <HeroBanner banners={heroBanners} />
      <FeatureStrip />
      <CategoryGrid categories={dbCategories} />
      <BrandMarquee />
      <NewArrivals />
      <PromoBanner banner={activePromo} />
      <BestSellers />
      <NewsletterBanner banner={activeNewsletter} />
    </div>
  );
}
