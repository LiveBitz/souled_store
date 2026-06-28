import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small uppercase label above the title (e.g. "Just dropped") */
  eyebrow?: string;
  /** Optional icon shown before the eyebrow label */
  eyebrowIcon?: LucideIcon;
  /** Tailwind text color class for the eyebrow (defaults to brand) */
  eyebrowClassName?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  eyebrowIcon: Icon,
  eyebrowClassName,
  title,
  subtitle,
  trailing,
}: SectionHeadingProps) {
  // Consistent accent rule across every section: the LAST word is italic + brand.
  const words = title.split(" ");
  const lead = words.slice(0, -1).join(" ");
  const accent = words[words.length - 1];

  return (
    <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
      <div className="space-y-2.5">
        {eyebrow && (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.18em]",
              eyebrowClassName || "text-brand"
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {eyebrow}
          </div>
        )}
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-black tracking-tight text-zinc-900 leading-[1.1]">
          {lead && <span>{lead} </span>}
          <span className="italic text-brand">{accent}</span>
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-lg leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {trailing && <div className="text-sm font-bold shrink-0">{trailing}</div>}
    </div>
  );
}
