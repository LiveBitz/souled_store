import React from "react";
import prisma from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

interface NewProductPageProps {
  searchParams: Promise<{ catId?: string }>;
}

async function getUniqueSubCategories() {
  const products = await prisma.product.findMany({
    select: { categoryId: true, subCategory: true },
    orderBy: { subCategory: 'asc' }
  });
  
  const mapping: Record<string, string[]> = {};
  products.forEach(p => {
    if (!p.subCategory) return;
    if (!mapping[p.categoryId]) {
      mapping[p.categoryId] = [];
    }
    if (!mapping[p.categoryId].includes(p.subCategory)) {
      mapping[p.categoryId].push(p.subCategory);
    }
  });
  
  return mapping;
}

async function getUniqueColors() {
  const products = await prisma.product.findMany({ select: { colors: true } });
  const set = new Set<string>();
  products.forEach((p) =>
    ((p.colors as string[]) || []).forEach((c) => c && set.add(c))
  );
  return Array.from(set);
}

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const { catId } = await searchParams;
  const [categories, subCategories, existingColors] = await Promise.all([
    getCategories(),
    getUniqueSubCategories(),
    getUniqueColors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
      <ProductForm
        categories={categories}
        preSelectedCategoryId={catId}
        existingSubCategories={subCategories}
        existingColors={existingColors}
      />
    </div>
  );
}
