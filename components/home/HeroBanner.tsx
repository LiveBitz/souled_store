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
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    Autoplay({ delay: 3000, stopOnInteraction: true })
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
              {/*
                Link and inner div both carry explicit height via inline style
                so the fill Image always has a non-zero parent height —
                even before Tailwind CSS hydrates on the client.
              */}
              <Link
                href={(slide as any).link || "/"}
                className="block cursor-pointer group"
              >
                <div
                  className="relative w-full h-[180px] sm:h-[380px] md:h-[460px] lg:h-[580px]"
                  style={{ minHeight: "180px" }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    priority
                    quality={85}
                    sizes="100vw"
                  />

                  {/* Bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrow buttons */}
        <CarouselControls />
      </Carousel>
    </section>
  );
}
