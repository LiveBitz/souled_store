import React from "react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import { TrendingUp } from "lucide-react";
import { AnimateOnView } from "@/components/shared/AnimateOnView";
import { SectionHeading } from "@/components/shared/SectionHeading";

async function getBestSellers() {
  const products = await prisma.product.findMany({
    where: { isBestSeller: true, stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  return products;
}

export async function BestSellers() {
  const bestsellerProducts = await getBestSellers();
  if (bestsellerProducts.length === 0) return null;

  return (
    <section id="best-sellers" className="relative py-16 md:py-24 bg-zinc-950 overflow-hidden">
      {/* Soft brand glow for depth */}
      <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-brand/5 blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <AnimateOnView>
          <SectionHeading
            eyebrow="Most popular"
            eyebrowIcon={TrendingUp}
            eyebrowClassName="text-amber-400"
            title="Best Sellers"
            subtitle="Loved by thousands of customers."
            inverted
          />
        </AnimateOnView>

        {/* Grid */}
        <AnimateOnView delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {bestsellerProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} dark />
          ))}
        </div>
        </AnimateOnView>

      </div>
    </section>
  );
}
