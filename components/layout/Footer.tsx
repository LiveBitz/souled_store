import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 mt-20 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Column 1: Brand */}
        <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="text-2xl font-bold tracking-tight text-brand">
            Unique Hub
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Premium clothing and lifestyle products for the modern individual.
          </p>
        </div>

        {/* Column 2: Categories */}
        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-heading">
            Shop By Category
          </h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <Link href="/category/men" className="hover:text-brand transition-colors">Men</Link>
            <Link href="/category/watches" className="hover:text-brand transition-colors">Watches</Link>
            <Link href="/category/perfumes" className="hover:text-brand transition-colors">Perfumes</Link>
            <Link href="/category/foot-wears" className="hover:text-brand transition-colors">Foot Wears</Link>
          </div>
        </div>

        {/* Column 3: Legal */}
        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-heading">
            Legal
          </h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-brand transition-colors">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
          </div>
        </div>

        {/* Column 4: Contact */}
        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-heading">
            Contact Us
          </h4>
          <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="flex gap-3 items-start">
              <Mail className="w-5 h-5 text-zinc-700 shrink-0" />
              <a href="mailto:support@uniquehub.store" className="hover:text-brand transition-colors">support@uniquehub.store</a>
            </div>
            <div className="flex gap-3 items-start">
              <Phone className="w-5 h-5 text-zinc-700 shrink-0" />
              <a href="tel:+919876543210" className="hover:text-brand transition-colors">+91 98765 43210</a>
            </div>
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-zinc-700 shrink-0" />
              <span>Mumbai, Maharashtra, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <p>© {currentYear} Unique Hub. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <Link href="/terms" className="hover:text-brand transition-colors font-medium">Terms</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-brand transition-colors font-medium">Privacy</Link>
          </div>
        </div>
        <p className="text-xs text-zinc-400 font-medium">
          Built by <span className="font-semibold text-zinc-600">Himanshu Meena</span> &amp; <span className="font-semibold text-zinc-600">Ashibur Rehman</span>
        </p>
      </div>
    </footer>
  );
}
