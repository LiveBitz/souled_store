import React from "react";
import prisma from "@/lib/prisma";
import { CategoryCatalog } from "@/components/catalog/CategoryCatalog";

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  // Fetch products from database based on category slug
  const products = await prisma.product.findMany({
    where: slug === "sale" 
      ? { discount: { gt: 0 } }
      : slug === "new-arrivals"
      ? { isNew: true }
      : { 
          category: {
             slug: {
                equals: slug,
                mode: "insensitive"
             }
          } 
        },
    include: {
      category: {
        select: {
          name: true,
          slug: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-white transition-opacity duration-300">
      <CategoryCatalog initialProducts={products as any} slug={slug} />
    </div>
  );
}
