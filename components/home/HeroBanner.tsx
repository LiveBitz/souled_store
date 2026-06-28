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
import { cn } from "@/lib/utils";

// Glassy arrows — hidden on mobile (swipe + dots there), reveal on hover on desktop.
function CarouselControls() {
  const { scrollPrev, scrollNext } = useCarousel();
  const base =
    "absolute top-1/2 -translate-y-1/2 z-20 hidden sm:flex w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover/hero:opacity-100 hover:bg-white/25 hover:scale-105 active:scale-95";
  return (
    <>
      <button onClick={scrollPrev} aria-label="Previous slide" className={cn(base, "left-4 lg:left-6")}>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={scrollNext} aria-label="Next slide" className={cn(base, "right-4 lg:right-6")}>
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  );
}

// Premium slide indicators — animated active pill, click to jump.
function CarouselDots({ count }: { count: number }) {
  const { api } = useCarousel();
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (count <= 1) return null;

  return (
    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-2.5 sm:bottom-5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => api?.scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={cn(
            "h-2.5 w-2.5 rounded-full border border-white/60 shadow-sm transition-all duration-300 sm:h-3 sm:w-3",
            selected === i
              ? "scale-110 bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.15)]"
              : "bg-white/35 hover:bg-white/60"
          )}
        />
      ))}
    </div>
  );
}

interface HeroBannerProps {
  banners?: Banner[];
}

export function HeroBanner({ banners = [] }: HeroBannerProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden group/hero bg-zinc-950">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{ loop: true }}
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
                className="block cursor-pointer group/slide"
              >
                <div
                  className="relative w-full aspect-[4/5] sm:aspect-auto sm:h-[420px] md:h-[500px] lg:h-[600px]"
                  style={{ minHeight: "180px" }}
                >
                  {/* Mobile: portrait image (falls back to the main image) */}
                  <Image
                    src={(slide as any).mobileImage || slide.image}
                    alt={slide.title}
                    fill
                    className="sm:hidden object-cover object-center transition-transform duration-[1200ms] ease-out group-hover/slide:scale-105"
                    priority
                    quality={90}
                    sizes="100vw"
                  />
                  {/* Desktop / tablet: wide landscape image */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="hidden sm:block object-cover object-center transition-transform duration-[1200ms] ease-out group-hover/slide:scale-105"
                    priority
                    quality={90}
                    sizes="100vw"
                  />

                  {/* Cinematic overlays — subtle bottom fade + soft edge vignette for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.28))] pointer-events-none" />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselControls />
        <CarouselDots count={banners.length} />
      </Carousel>
    </section>
  );
}
