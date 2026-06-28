import React from "react";

// The luxury houses carried by the store (from the provided brand sheet).
const brands = [
  "Montblanc",
  "Balenciaga",
  "Prada",
  "Céline",
  "Louis Vuitton",
  "Chaumet",
  "Alaïa",
  "Giorgio Armani",
  "Bvlgari",
  "Chanel",
  "Gucci",
  "Burberry",
  "Cartier",
  "Calvin Klein",
  "Hermès",
  "Chopard",
  "Chloé",
  "Givenchy",
  "Saint Laurent",
  "Rolex",
  "Kenzo",
  "Guerlain",
  "Dior",
  "Miu Miu",
  "Van Cleef & Arpels",
  "Salvatore Ferragamo",
  "Fendi",
  "Piaget",
  "Tiffany & Co.",
  "Versace",
  "Ralph Lauren",
];

// Minimal 🔥 emojis rising from an edge, drifting up and fading out.
function EmberColumn({ side }: { side: "left" | "right" }) {
  const embers = [
    { delay: 0, dur: 3.4, size: "text-base", offset: 2 },
    { delay: 1.1, dur: 4.1, size: "text-lg", offset: 14 },
    { delay: 2.2, dur: 3.7, size: "text-sm", offset: 6 },
  ];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute bottom-1 z-20 ${
        side === "left" ? "left-1 sm:left-3" : "right-1 sm:right-3"
      }`}
    >
      {embers.map((e, i) => (
        <span
          key={i}
          className={`ember absolute bottom-0 ${e.size} select-none`}
          style={{
            left: side === "left" ? `${e.offset}px` : undefined,
            right: side === "right" ? `${e.offset}px` : undefined,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.dur}s`,
          }}
        >
          🔥
        </span>
      ))}
    </div>
  );
}

export function BrandMarquee() {
  // Render the list twice so the -50% → 0 animation loops seamlessly.
  const loop = [...brands, ...brands];

  return (
    <section className="relative bg-white border-y border-zinc-100 py-8 md:py-10 overflow-hidden">
      {/* Rising fire emojis from both edges */}
      <EmberColumn side="left" />
      <EmberColumn side="right" />

      <p className="text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 mb-6 md:mb-8">
        Trusted brands we carry
      </p>

      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="brand-marquee-track flex w-max items-center gap-12 md:gap-16">
          {loop.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="font-heading text-lg md:text-2xl font-semibold tracking-[0.12em] text-zinc-400 whitespace-nowrap uppercase"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
