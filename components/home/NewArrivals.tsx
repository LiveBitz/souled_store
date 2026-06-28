import React from "react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import { getTotalStock } from "@/lib/inventory";
import { Flame } from "lucide-react";
import { AnimateOnView } from "@/components/shared/AnimateOnView";
import { SectionHeading } from "@/components/shared/SectionHeading";

async function getNewArrivals() {
  const products = await prisma.product.findMany({
    where: { isNew: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return products.filter((p) => getTotalStock(p.sizes) > 0).slice(0, 8);
}

export async function NewArrivals() {
  const featuredProducts = await getNewArrivals();
  if (featuredProducts.length === 0) return null;

  return (
    <section id="new-arrivals" className="relative overflow-hidden py-16 md:py-24 bg-white">
      {/* Aurora glow — drifts continuously up from the bottom corners */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Footer blend */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#14090b] via-[#2a0f13]/60 to-transparent" />

        <div
          className="absolute bottom-[-8rem] left-[-6rem] h-[28rem] w-[28rem] rounded-full blur-[220px]"
          style={{ background: "radial-gradient(circle, rgba(68,18,24,0.95) 0%, rgba(40,12,15,0.46) 36%, rgba(24,10,12,0.12) 68%, transparent 100%)" }}
        />
        <div
          className="absolute bottom-[-8rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full blur-[220px]"
          style={{ background: "radial-gradient(circle, rgba(92,24,29,0.88) 0%, rgba(48,14,16,0.34) 40%, rgba(24,10,12,0.08) 72%, transparent 100%)" }}
        />

        {/* Subtle vignette layer */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[radial-gradient(ellipse_at_center_bottom,rgba(45,10,13,0.18),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <AnimateOnView>
          <SectionHeading
            eyebrow="Just dropped"
            eyebrowIcon={Flame}
            title="New Arrivals"
          />
        </AnimateOnView>

        {/* Grid */}
        <AnimateOnView delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
        </AnimateOnView>

      </div>
    </section>
  );
}
