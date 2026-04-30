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

// Must live inside <Carousel> to access context via useCarousel()
function CarouselControls() {
  const { scrollPrev, scrollNext } = useCarousel();
  return (
    <>
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-all"
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
      {/*
        Do NOT pass className to CarouselContent or CarouselItem.
        Modifying their internal classes causes a server/client hydration mismatch.
        Instead, each slide's inner div carries the explicit height —
        the Carousel div sizes itself from content, so top-1/2 on the
        arrow buttons calculates correctly against the real banner height.
      */}
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((slide) => (
            <CarouselItem key={slide.id}>
              <Link
                href={(slide as any).link || "/"}
                className="block cursor-pointer group"
              >
                {/* Explicit height here → Carousel div inherits it → top-1/2 works */}
                <div className="relative h-[280px] sm:h-[380px] md:h-[460px] lg:h-[580px] w-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    priority
                    quality={85}
                  />

                  {/* Bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  {/* CTA */}
                  {slide.buttonText && (
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-12 z-10">
                      <span className="inline-flex items-center gap-2 bg-white text-zinc-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
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

        {/* Arrow buttons — absolute within the Carousel div, centred via top-1/2 */}
        <CarouselControls />
      </Carousel>
    </section>
  );
}
