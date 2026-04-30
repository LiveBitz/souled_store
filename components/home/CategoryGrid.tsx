import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Category } from "@prisma/client";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section id="categories" className="py-16 md:py-24 bg-zinc-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="Shop by Category"
          subtitle="Explore our curated collections for every style and occasion."
        />

        {/* Mobile: 2-col grid with fixed height — reliable on all devices */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.name.toLowerCase()}`}
              className="group relative h-44 overflow-hidden rounded-2xl bg-zinc-200"
            >
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  quality={75}
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-bold text-sm leading-tight">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: bento grid — explicit row heights fix the col/row-span aspect-ratio issue */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 grid-rows-[220px_220px] gap-4 lg:gap-5">
          {categories.map((category, idx) => (
            <Link
              key={category.id}
              href={`/category/${category.name.toLowerCase()}`}
              className={`group relative overflow-hidden rounded-2xl bg-zinc-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                idx === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  quality={75}
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                <div>
                  <h3 className="text-white font-bold text-base md:text-lg leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-white/60 text-xs mt-0.5 font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    Shop Now
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
