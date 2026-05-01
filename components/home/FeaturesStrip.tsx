"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, Gift } from "lucide-react";
import { motion } from "framer-motion";

// Each item fully hardcoded — Tailwind v4 scans JSX for complete class strings.
// Dynamic className values in JS object properties are not reliably picked up.
const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    subtitle: "On orders above ₹499",
    wrapperClass: "bg-blue-50",
    iconClass: "text-blue-600",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "7-day hassle-free returns",
    wrapperClass: "bg-emerald-50",
    iconClass: "text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% safe checkout",
    wrapperClass: "bg-violet-50",
    iconClass: "text-violet-600",
  },
  {
    icon: Gift,
    title: "Gift Wrapping",
    subtitle: "Available on request",
    wrapperClass: "bg-amber-50",
    iconClass: "text-amber-600",
  },
] as const;

// Tailwind v4 safeguard: keep these class strings visible so the scanner
// always includes them in the CSS bundle.
// bg-blue-50 text-blue-600
// bg-emerald-50 text-emerald-600
// bg-violet-50 text-violet-600
// bg-amber-50 text-amber-600

export function FeaturesStrip() {
  return (
    <section className="py-10 md:py-14 bg-white border-y border-zinc-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
                delay: idx * 0.09,
              }}
              viewport={{ once: true, margin: "-40px" }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 text-center sm:text-left"
            >
              <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${feature.wrapperClass}`}>
                <feature.icon className={`w-5 h-5 ${feature.iconClass}`} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-zinc-900">
                  {feature.title}
                </h4>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
