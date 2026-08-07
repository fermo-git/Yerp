import { Hero } from "@/components/business/Hero";
import { CategoryStrip } from "@/components/business/CategoryStrip";
import { BorderWidgetsStrip } from "@/components/widgets/BorderWidgetsStrip";
import { FeaturedBusinesses } from "@/components/business/FeaturedBusinesses";
import { PromoBanner } from "@/components/business/PromoBanner";
import { RecentActivity } from "@/components/business/RecentActivity";

export function LandingPage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <div className="py-8">
        <BorderWidgetsStrip />
      </div>
      <FeaturedBusinesses />
      <PromoBanner />
      <RecentActivity />
    </>
  );
}
