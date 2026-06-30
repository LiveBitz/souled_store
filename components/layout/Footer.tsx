import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-zinc-400 pt-16 pb-8">
      {/* Soft brand glow — kept away from the top seam so it merges with the
          Best Sellers section above (both are pure zinc-950 at the join). */}
      <div className="absolute top-1/3 -left-24 w-96 h-96 rounded-full bg-brand/[0.06] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-0 w-96 h-96 rounded-full bg-brand/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex w-fit items-center rounded-xl bg-white/95 p-2.5 shadow-sm">
              <Image src="/logo.png" alt="Unique Hub" width={64} height={64} className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Premium clothing and lifestyle products for the modern individual.
            </p>
          </div>

          {/* Column 2: Categories */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Shop By Category
            </h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              <Link href="/" className="hover:text-brand transition-colors w-fit">Home</Link>
              <Link href="/category/men" className="hover:text-brand transition-colors w-fit">Men</Link>
              <Link href="/category/watches" className="hover:text-brand transition-colors w-fit">Watches</Link>
              <Link href="/category/perfumes" className="hover:text-brand transition-colors w-fit">Perfumes</Link>
              <Link href="/category/foot-wears" className="hover:text-brand transition-colors w-fit">Foot Wears</Link>
            </div>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Legal
            </h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              <Link href="/terms" className="hover:text-brand transition-colors w-fit">Terms &amp; Conditions</Link>
              <Link href="/privacy" className="hover:text-brand transition-colors w-fit">Privacy Policy</Link>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Contact Us
            </h4>
            <div className="flex flex-col gap-4 text-sm text-zinc-400">
              <div className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-zinc-500 shrink-0" />
                <a href="tel:+917076947260" className="hover:text-brand transition-colors">+91 70769 47260</a>
              </div>
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>Dhubulia, Krishnagar, Nadia — Pin 741140</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="container mx-auto px-4 md:px-8 lg:px-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p>© {currentYear} Unique Hub. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <Link href="/terms" className="hover:text-brand transition-colors font-medium">Terms</Link>
              <span>·</span>
              <Link href="/privacy" className="hover:text-brand transition-colors font-medium">Privacy</Link>
            </div>
          </div>
          <a
            href="https://scalisite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 shadow-sm transition-all duration-300 hover:border-brand/40 hover:bg-zinc-800/60"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
              Built by
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex items-center justify-center rounded-md bg-white px-1 py-0.5 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <img
                  src="https://www.scalisite.com/Logo.png"
                  alt="Scalisite"
                  className="h-4 w-auto object-contain"
                />
              </span>
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-sm font-extrabold tracking-tight text-transparent transition-all duration-300 group-hover:from-brand group-hover:to-brand/70">
                Scalisite
              </span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
