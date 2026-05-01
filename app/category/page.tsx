import React from "react";
import prisma from "@/lib/prisma";
import { CategoryCatalog } from "@/components/catalog/CategoryCatalog";

export const revalidate = 3600;

export default async function AllProductsPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      subCategory: true,
      categoryId: true,
      price: true,
      originalPrice: true,
      discount: true,
      image: true,
      stock: true,
      sizes: true,
      colors: true,
      isNew: true,
      isBestSeller: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white transition-opacity duration-300">
      <CategoryCatalog initialProducts={products as any} slug="all" />
    </div>
  );
}
