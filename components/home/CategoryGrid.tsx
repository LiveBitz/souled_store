import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shirt, Footprints, Watch, SprayCan, ShoppingBag, Glasses } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AnimateOnView } from "@/components/shared/AnimateOnView";
import { Category } from "@prisma/client";

interface CategoryGridProps {
  categories: Category[];
}

// Minimal product icons that drift up and vanish across the top of the section.
const floatingIcons = [
  { Icon: Shirt, left: "8%", delay: 0, dur: 11, size: 26 },
  { Icon: Footprints, left: "24%", delay: 2.5, dur: 13, size: 30 },
  { Icon: Watch, left: "42%", delay: 5, dur: 12, size: 24 },
  { Icon: SprayCan, left: "60%", delay: 1.5, dur: 12.5, size: 28 },
  { Icon: ShoppingBag, left: "77%", delay: 3.8, dur: 11.5, size: 26 },
  { Icon: Glasses, left: "90%", delay: 6.2, dur: 13, size: 28 },
];

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Only show categories that have an image so no blank grey cards appear
  const withImages = categories.filter((c) => c.image);
  if (withImages.length === 0) return null;

  const featured = withImages[0];
  const rest = withImages.slice(1, 5);

  return (
    <section id="categories" className="relative overflow-hidden py-16 md:py-24 bg-white">
      {/* Floating product icons drifting down and vanishing across the top */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden z-0">
        {floatingIcons.map(({ Icon, left, delay, dur, size }, i) => (
          <span
            key={i}
            className={`float-icon absolute top-0 ${i % 2 === 0 ? "text-brand/70" : "text-zinc-500/60"}`}
            style={{ left, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
          >
            <Icon style={{ width: size, height: size }} strokeWidth={1.5} />
          </span>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <AnimateOnView>
          <SectionHeading
            title="Shop by Category"
          />
        </AnimateOnView>

        {/* Mobile: 2-col grid — use inline style for height, same as desktop cards */}
        <AnimateOnView delay={0.12}>
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {withImages.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
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
            href={`/category/${featured.name.toLowerCase().replace(/\s+/g, "-")}`}
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
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
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

          </div>
        </div>
        </AnimateOnView>

      </div>
    </section>
  );
}
