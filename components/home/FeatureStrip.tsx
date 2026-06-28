import React from "react";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

const features = [
  { icon: Truck, title: "Free & Fast Shipping", sub: "On orders above ₹499" },
  { icon: RotateCcw, title: "Easy Returns", sub: "7-day returns & exchanges" },
  { icon: ShieldCheck, title: "100% Genuine", sub: "Verified authentic products" },
];

export function FeatureStrip() {
  return (
    <section className="bg-brand text-white">
      <div className="container mx-auto px-3 md:px-8 lg:px-16">
        <div className="grid grid-cols-3 divide-x divide-white/20">
          {features.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center sm:text-left px-2 py-4 md:py-5"
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 shrink-0" strokeWidth={1.75} />
              <div className="min-w-0">
                <p className="text-[11px] md:text-sm font-bold leading-tight">{title}</p>
                <p className="text-[9px] md:text-xs text-white/75 font-medium leading-tight mt-0.5">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
