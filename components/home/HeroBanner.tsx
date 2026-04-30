"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Banner } from "@prisma/client";

interface HeroBannerProps {
  banners?: Banner[];
}

export function HeroBanner({ banners = [] }: HeroBannerProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((slide) => (
            <CarouselItem key={slide.id}>
              <Link href={(slide as any).link || "/"} className="block cursor-pointer group">
                <div className="relative h-[300px] md:h-[450px] lg:h-[600px] w-full flex items-center">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    quality={85}
                  />

                  {/* Multi-layer gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center px-6 md:px-14 lg:px-24">
                    <div className="max-w-xl space-y-4 md:space-y-5">
                      {/* Collection tag */}
                      <div className="inline-flex items-center gap-2 bg-brand/90 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        New Collection
                      </div>

                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
                        {slide.title}
                      </h1>

                      {slide.subtitle && (
                        <p className="text-sm md:text-base lg:text-lg text-white/75 font-medium max-w-md leading-relaxed">
                          {slide.subtitle}
                        </p>
                      )}

                      {slide.buttonText && (
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-2.5 bg-white text-zinc-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-zinc-100 transition-all shadow-lg shadow-black/20">
                            {slide.buttonText}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows */}
        <div className="hidden lg:block">
          <CarouselPrevious className="left-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 h-12 w-12 rounded-xl transition-all" />
          <CarouselNext className="right-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 h-12 w-12 rounded-xl transition-all" />
        </div>
      </Carousel>
    </section>
  );
}
