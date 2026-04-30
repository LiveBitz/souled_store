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
    <section className="relative w-full overflow-hidden">
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
                <div className="relative h-[300px] md:h-[450px] lg:h-[600px] w-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    priority
                    quality={85}
                  />

                  {/* Subtle gradient only on bottom-left so image design is not blocked */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

                  {/* Button pinned to bottom-left */}
                  {slide.buttonText && (
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-12 lg:bottom-12 lg:left-16 z-10">
                      <span className="inline-flex items-center gap-2 bg-white text-zinc-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:bg-zinc-100 transition-all">
                        {slide.buttonText}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Nav arrows — inside the banner, vertically centered */}
        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/40 h-10 w-10 rounded-xl transition-all" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/40 h-10 w-10 rounded-xl transition-all" />
      </Carousel>
    </section>
  );
}
