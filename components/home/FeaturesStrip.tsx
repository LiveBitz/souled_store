import React from "react";
import { Truck, RotateCcw, ShieldCheck, Gift } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    subtitle: "On orders above ₹499",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "7-day hassle-free returns",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% safe checkout",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Gift,
    title: "Gift Wrapping",
    subtitle: "Available on request",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export function FeaturesStrip() {
  return (
    <section className="py-10 md:py-14 bg-white border-y border-zinc-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 text-center sm:text-left">
                <div
                  className={`w-11 h-11 shrink-0 rounded-2xl ${feature.bg} flex items-center justify-center`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-extrabold text-zinc-900">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    {feature.subtitle}
                  </p>
                </div>
              </div>

              {/* Vertical divider between items on desktop */}
              {idx < features.length - 1 && (
                <div className="hidden lg:block absolute" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
