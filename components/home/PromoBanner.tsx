import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { Banner } from "@prisma/client";
import Link from "next/link";

interface PromoBannerProps {
  banner?: Banner | null;
}

export function PromoBanner({ banner }: PromoBannerProps) {
  if (!banner) return null;

  const displayTitle = banner.title;
  const displaySubtitle = banner.subtitle || "";
  const displayImage = banner.image;
  const displayButtonText = banner.buttonText || "Shop Now";
  const displayLink = banner.link || "/";

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 container mx-auto">
      <Link href={displayLink} className="block group">
        <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-950 text-white min-h-[400px] flex items-center">
          <Image
            src={displayImage}
            alt="Promotion"
            fill
            className="object-cover opacity-40 transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="relative z-10 p-8 md:p-16 lg:p-24 max-w-2xl space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight tracking-tighter whitespace-pre-line">
              {displayTitle.split('\n')[0]} <br />
              <span className="text-brand">{displayTitle.split('\n')[1] || ""}</span>
            </h2>
            <p className="text-zinc-300 text-lg md:text-xl font-medium max-w-md">
              {displaySubtitle}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-brand/20 to-transparent hidden lg:block" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand/10 blur-3xl rounded-full" />
        </div>
      </Link>
    </section>
  );
}
