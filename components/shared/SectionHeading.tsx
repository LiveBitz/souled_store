import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}

export function SectionHeading({ title, subtitle, trailing }: SectionHeadingProps) {
  const words = title.split(" ");
  const firstWord = words[0];
  const rest = words.slice(1).join(" ");

  return (
    <div className="flex items-end justify-between mb-8 md:mb-10 group">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
          <span className="italic text-brand">{firstWord}</span>
          {rest && <span> {rest}</span>}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-zinc-500 max-w-lg font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {trailing && <div className="text-sm font-bold">{trailing}</div>}
    </div>
  );
}
