import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

async function getNewArrivals() {
  return await prisma.product.findMany({
    where: { isNew: true },
    take: 8,
    orderBy: { createdAt: 'desc' }
  });
}

export async function NewArrivals() {
  const featuredProducts = await getNewArrivals();

  if (featuredProducts.length === 0) return null;

  return (
    <section id="new-arrivals" className="py-14 container mx-auto">
      <div className="px-4 md:px-8 lg:px-16 mb-8">
        <SectionHeading 
          title="New Arrivals" 
          subtitle="Be the first to wear our latest designs and exclusive drops."
          trailing={
            <Link 
              href="/category/new-arrivals" 
              className="text-brand hover:underline font-bold text-sm tracking-tight flex items-center gap-1 group"
            >
              View All 
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          }
        />
      </div>
      
      {/* Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="relative">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-x-visible pb-8 gap-4 md:gap-6 no-scrollbar px-4 md:px-8 lg:px-16 snap-x snap-mandatory scroll-smooth">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="min-w-[280px] md:min-w-0 snap-start"
            >
              <ProductCard product={product as any} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
