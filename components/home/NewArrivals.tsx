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
    <section id="new-arrivals" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

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
