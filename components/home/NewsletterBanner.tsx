"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles } from "lucide-react";
import { Banner } from "@prisma/client";

interface NewsletterBannerProps {
  banner?: Banner | null;
}

export function NewsletterBanner({ banner }: NewsletterBannerProps) {
  if (!banner) return null;

  const displayTitle = banner.title;
  const displaySubtitle = banner.subtitle || "";
  const displayButtonText = banner.buttonText || "Subscribe";

  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-56px" }}
          className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-8 md:p-12 lg:p-16"
        >

          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/[0.02] border border-white/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            {/* Text */}
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/30 text-brand text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                Stay in the Loop
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {displayTitle}
              </h2>
              {displaySubtitle && (
                <p className="text-white/60 text-sm md:text-base font-medium leading-relaxed max-w-md">
                  {displaySubtitle}
                </p>
              )}
            </div>

            {/* Form */}
            <div className="w-full md:w-auto md:min-w-[360px]">
              <form
                className="flex flex-col sm:flex-row gap-2.5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-white/8 border border-white/15 text-white placeholder:text-white/35 focus:border-white/35 focus-visible:ring-0 pl-10 h-12 rounded-xl text-sm"
                    required
                  />
                </div>
                <Button className="bg-brand hover:bg-brand/90 text-white px-6 h-12 rounded-xl font-bold text-sm transition-all shrink-0 shadow-lg shadow-brand/30 active:scale-95">
                  {displayButtonText}
                </Button>
              </form>
              <p className="text-white/30 text-xs mt-2.5 font-medium">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
