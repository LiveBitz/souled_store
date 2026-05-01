import React from "react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import { TrendingUp } from "lucide-react";
import { AnimateOnView } from "@/components/shared/AnimateOnView";

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
    <section id="best-sellers" className="py-16 md:py-24 bg-zinc-50/80">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Section header */}
        <AnimateOnView>
        <div className="mb-10 md:mb-12">
          <div className="space-y-2">
            {/* Label */}
            <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-black uppercase tracking-[0.15em]">
              <TrendingUp className="w-3 h-3" />
              Most popular
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
              Best <span className="italic text-brand">Sellers</span>
            </h2>
            <p className="text-sm text-zinc-400 font-medium max-w-sm">
              Loved by thousands of customers
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-zinc-200 mb-8" />
        </AnimateOnView>

        {/* Grid */}
        <AnimateOnView delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {bestsellerProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
        </AnimateOnView>

      </div>
    </section>
  );
}
