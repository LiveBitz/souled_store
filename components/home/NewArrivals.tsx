import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getTotalStock } from "@/lib/inventory";
import { ArrowRight } from "lucide-react";

async function getNewArrivals() {
  const products = await prisma.product.findMany({
    where: {
      isNew: true,
    },
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
        <SectionHeading
          title="New Arrivals"
          subtitle="Discover our latest designs and exclusive collections."
          trailing={
            <Link
              href="/category"
              className="flex items-center gap-1.5 text-brand hover:text-brand/80 transition-colors font-bold text-sm"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
