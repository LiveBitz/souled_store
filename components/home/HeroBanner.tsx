"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Banner } from "@prisma/client";

interface HeroBannerProps {
  banners?: Banner[];
}

export function HeroBanner({ banners = [] }: HeroBannerProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950">
      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((slide) => (
            <CarouselItem key={slide.id}>
              <Link href={(slide as any).link || "/"} className="block cursor-pointer group">
                <div className="relative h-[360px] md:h-[500px] lg:h-[640px] w-full flex items-center">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-[8000ms] ease-linear group-hover:scale-105"
                    priority
                    quality={85}
                  />

                  {/* Multi-layer gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center px-6 md:px-14 lg:px-24">
                    <div className="max-w-xl space-y-4 md:space-y-6">
                      {/* Label tag */}
                      <div className="inline-flex items-center gap-2 bg-brand/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        New Collection
                      </div>

                      <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight">
                        {slide.title}
                      </h1>

                      {slide.subtitle && (
                        <p className="text-sm md:text-base lg:text-lg text-white/75 font-medium max-w-md leading-relaxed">
                          {slide.subtitle}
                        </p>
                      )}

                      {slide.buttonText && (
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2.5 bg-white text-zinc-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-zinc-100 transition-all active:scale-95 shadow-lg shadow-black/20">
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

        {/* Slide dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        )}

        {/* Slide counter */}
        {banners.length > 1 && (
          <div className="absolute bottom-5 right-6 text-white/50 text-xs font-bold tabular-nums">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(banners.length).padStart(2, "0")}
          </div>
        )}
      </Carousel>
    </section>
  );
}
