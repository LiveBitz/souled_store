"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Banner } from "@prisma/client";

// Custom nav buttons using useCarousel — avoids tailwind-merge fighting default positioning
function CarouselControls() {
  const { scrollPrev, scrollNext } = useCarousel();
  return (
    <>
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/35 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/35 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  );
}

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
                  {/* Bottom gradient for button readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* CTA button — bottom left */}
                  {slide.buttonText && (
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-12 z-10">
                      <span className="inline-flex items-center gap-2 bg-white text-zinc-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg">
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

        {/* Custom arrows — no tailwind-merge conflict */}
        <CarouselControls />
      </Carousel>
    </section>
  );
}
