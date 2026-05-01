import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AnimateOnView } from "@/components/shared/AnimateOnView";
import { Category } from "@prisma/client";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  const featured = categories[0];
  const rest = categories.slice(1, 5);

  return (
    <section id="categories" className="py-16 md:py-24 bg-zinc-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <AnimateOnView>
          <SectionHeading
            title="Shop by Category"
            subtitle="Explore our curated collections for every style and occasion."
          />
        </AnimateOnView>

        {/* Mobile: 2-col grid — use inline style for height, same as desktop cards */}
        <AnimateOnView delay={0.12}>
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.name.toLowerCase()}`}
              className="group relative block overflow-hidden rounded-2xl bg-zinc-300"
              style={{ height: "160px" }}
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
        </AnimateOnView>

        {/* Desktop: bento layout — explicit heights, no CSS grid row-span issues */}
        <AnimateOnView delay={0.12}>
        <div className="hidden md:flex gap-4 lg:gap-5">

          {/* Featured large card (left half) */}
          <Link
            href={`/category/${featured.name.toLowerCase()}`}
            className="group relative w-1/2 shrink-0 overflow-hidden rounded-2xl bg-zinc-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            style={{ height: "460px" }}
          >
            {featured.image && (
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                quality={75}
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div>
                <h3 className="text-white font-bold text-xl leading-tight">
                  {featured.name}
                </h3>
                <p className="text-white/60 text-xs mt-1 font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  Shop Now
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </Link>

          {/* Right: 2×2 grid of smaller cards */}
          <div className="flex-1 grid grid-cols-2 gap-4 lg:gap-5">
            {rest.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl bg-zinc-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ height: "220px" }}
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
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-bold text-base leading-tight">
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

            {/* If fewer than 4 rest items, fill with placeholders so grid doesn't collapse */}
            {rest.length < 4 &&
              Array.from({ length: 4 - rest.length }).map((_, i) => (
                <div key={`ph-${i}`} style={{ height: "220px" }} className="rounded-2xl bg-zinc-100" />
              ))}
          </div>
        </div>
        </AnimateOnView>

      </div>
    </section>
  );
}
