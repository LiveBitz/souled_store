import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ArrowRight } from "lucide-react";

async function getBestSellers() {
  const products = await prisma.product.findMany({
    where: {
      isBestSeller: true,
      stock: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return products;
}

export async function BestSellers() {
  const bestsellerProducts = await getBestSellers();

  if (bestsellerProducts.length === 0) return null;

  return (
    <section id="best-sellers" className="py-16 md:py-24 bg-zinc-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="Best Sellers"
          subtitle="The most loved pieces from our collection."
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
          {bestsellerProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
