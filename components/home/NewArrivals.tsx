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
        <div
          className="aurora-blob aurora-blob-left -bottom-52 -left-40 w-[36rem] h-[36rem] blur-[110px] opacity-65"
          style={{
            background:
              "radial-gradient(circle, rgba(255,170,60,0.45) 0%, rgba(232,74,74,0.30) 45%, transparent 70%)",
          }}
        />
        <div
          className="aurora-blob aurora-blob-right -bottom-56 -right-40 w-[36rem] h-[36rem] blur-[110px] opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(232,74,74,0.45) 0%, rgba(150,80,255,0.28) 45%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <AnimateOnView>
          <SectionHeading
            eyebrow="Just dropped"
            eyebrowIcon={Flame}
            title="New Arrivals"
            subtitle="Fresh styles added this week."
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
