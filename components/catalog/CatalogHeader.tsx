"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productsBySlug } from "@/lib/data";

interface CatalogHeaderProps {
  slug: string;
  count: number;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

export function CatalogHeader({ slug, count, sortBy, setSortBy }: CatalogHeaderProps) {
  const categoryName = !slug
    ? "Collection"
    : slug === "sale"
      ? "Seasonal Sale"
      : slug === "new-arrivals"
        ? "New Arrivals"
        : productsBySlug[slug] || (slug.charAt(0).toUpperCase() + slug.slice(1));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-xs md:text-sm text-zinc-600 hover:text-zinc-900">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-zinc-300" />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${slug}`} className="text-xs md:text-sm text-zinc-900 font-medium">{categoryName}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease, delay: 0.07 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
            {categoryName}
          </h1>
          <p className="text-sm md:text-base text-zinc-600 font-medium">
            {count} product{count !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Sort:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] rounded-lg bg-white border border-zinc-200 h-10 text-black">
              <SelectValue placeholder="Sort by" className="text-black" />
            </SelectTrigger>
            <SelectContent className="rounded-lg bg-white border-zinc-200">
              <SelectItem value="relevance" className="text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900">Relevance</SelectItem>
              <SelectItem value="price-asc" className="text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900">Price: Low to High</SelectItem>
              <SelectItem value="price-desc" className="text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900">Price: High to Low</SelectItem>
              <SelectItem value="newest" className="text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900">Newest First</SelectItem>
              <SelectItem value="discount" className="text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900">Best Discount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
    </div>
  );
}
