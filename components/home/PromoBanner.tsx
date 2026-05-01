import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Banner } from "@prisma/client";
import { AnimateOnView } from "@/components/shared/AnimateOnView";

interface PromoBannerProps {
  banner?: Banner | null;
}

export function PromoBanner({ banner }: PromoBannerProps) {
  if (!banner) return null;

  const displayTitle = banner.title;
  const displaySubtitle = banner.subtitle || "";
  const displayImage = banner.image;
  const displayLink = banner.link || "/";
  const displayButtonText = banner.buttonText || "Shop Now";

  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <AnimateOnView direction="up">
        <Link href={displayLink} className="block group">
          <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-950 min-h-[320px] md:min-h-[420px] flex items-center">
            <Image
              src={displayImage}
              alt="Promotion"
              fill
              className="object-cover opacity-50 transition-transform duration-[8000ms] ease-linear group-hover:scale-105"
            />

            {/* Gradient layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Decorative accent line */}
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-brand rounded-r-full" />

            <div className="relative z-10 px-8 md:px-14 lg:px-20 py-10 max-w-2xl space-y-4 md:space-y-5">
              {/* Eyebrow */}
              <p className="text-brand font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
                Limited Offer
              </p>

              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight">
                {displayTitle}
              </h2>

              {displaySubtitle && (
                <p className="text-sm md:text-base text-white/70 font-medium max-w-md leading-relaxed">
                  {displaySubtitle}
                </p>
              )}

              <div className="pt-2">
                <span className="inline-flex items-center gap-2.5 bg-brand text-white font-bold text-sm px-6 py-3 rounded-xl group-hover:bg-brand/90 transition-all shadow-lg shadow-brand/30">
                  {displayButtonText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </Link>
        </AnimateOnView>
      </div>
    </section>
  );
}
