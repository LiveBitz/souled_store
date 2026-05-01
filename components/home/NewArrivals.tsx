import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import { getTotalStock } from "@/lib/inventory";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimateOnView } from "@/components/shared/AnimateOnView";

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
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div className="space-y-2">
            {/* Label */}
            <div className="inline-flex items-center gap-1.5 text-brand text-xs font-black uppercase tracking-[0.15em]">
              <Sparkles className="w-3 h-3" />
              Just dropped
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
              New <span className="italic text-brand">Arrivals</span>
            </h2>
            <p className="text-sm text-zinc-400 font-medium max-w-sm">
              Fresh styles added this week
            </p>
          </div>

          <Link
            href="/category/new-arrivals"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-brand transition-colors border border-zinc-200 hover:border-brand px-4 py-2 rounded-xl"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-zinc-100 mb-8" />
        </AnimateOnView>

        {/* Grid */}
        <AnimateOnView delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
        </AnimateOnView>

        {/* Mobile view all */}
        <AnimateOnView delay={0.15}>
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/category/new-arrivals"
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600 border border-zinc-200 px-6 py-2.5 rounded-xl hover:border-brand hover:text-brand transition-all"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        </AnimateOnView>

      </div>
    </section>
  );
}
