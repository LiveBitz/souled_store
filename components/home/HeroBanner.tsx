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
import { heroSlides } from "@/lib/data";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Banner } from "@prisma/client";

interface HeroBannerProps {
  banners?: Banner[];
}

export function HeroBanner({ banners = [] }: HeroBannerProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  if (banners.length === 0) return null;

  const displaySlides = banners;

  return (
    <section className="relative w-full overflow-hidden bg-zinc-100">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {displaySlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <Link href={(slide as any).link || "/"} className="block cursor-pointer group">
                <div className="relative h-[250px] md:h-[500px] lg:h-[700px] w-full flex items-center">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                  />
                  
                  {/* Dynamic Content Overlay */}
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center sm:justify-start px-6 sm:px-20 lg:px-32">
                    <div className="max-w-2xl space-y-4 sm:space-y-6 text-center sm:text-left animate-in fade-in slide-in-from-bottom-5 duration-1000">
                      <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-none whitespace-pre-line drop-shadow-xl">
                        {slide.title}
                      </h2>
                      {slide.subtitle && (
                        <p className="text-sm sm:text-lg lg:text-xl text-white/90 font-medium max-w-md drop-shadow-lg">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation arrows visible only on larger screens */}
        <div className="hidden lg:block">
          <CarouselPrevious className="left-8 bg-white/20 border-white/20 text-white hover:bg-white hover:text-zinc-950 h-12 w-12" />
          <CarouselNext className="right-8 bg-white/20 border-white/20 text-white hover:bg-white hover:text-zinc-950 h-12 w-12" />
        </div>
      </Carousel>
    </section>
  );
}
