import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Check,
  Zap,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductSelection } from "@/components/catalog/ProductSelection";
import { AnimateOnView } from "@/components/shared/AnimateOnView";

// Phase 7: Cache product pages for 1 hour with ISR
export const revalidate = 3600;

async function getProduct(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      subCategory: true,
      description: true,
      price: true,
      originalPrice: true,
      discount: true,
      image: true,
      images: true,
      sizes: true,
      colors: true,
      isNew: true,
      isBestSeller: true,
      stock: true,
      features: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const discountPercentage =
    product.discount > 0
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  const savings = product.originalPrice - product.price;

  const specs = [
    { label: "Collection",      value: product.category.name },
    product.subCategory
      ? { label: "Type",         value: product.subCategory }
      : null,
    {
      label: "Sizes",
      value:
        (product.sizes as string[])?.map((s) => s.split(":")[0]).join(", ") ||
        "One Size",
    },
    {
      label: "Colors",
      value:
        product.colors.length > 0
          ? `${product.colors.length} variant${product.colors.length > 1 ? "s" : ""}`
          : "Single Color",
    },
    { label: "SKU",             value: product.slug.toUpperCase().replace(/-/g, "") },
    { label: "Return Policy",   value: "7-Day Easy Returns" },
    { label: "Shipping",        value: "Free above ₹499" },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="bg-white min-h-screen">

      {/* ── Breadcrumb ── */}
      <div className="border-b border-zinc-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <AnimateOnView direction="none">
            <nav className="flex items-center gap-2 py-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 overflow-x-auto whitespace-nowrap scrollbar-none">
              <a href="/" className="hover:text-zinc-700 transition-colors shrink-0">Home</a>
              <ChevronRight className="w-3 h-3 shrink-0 text-zinc-200" />
              <a href={`/category/${product.category.slug}`} className="hover:text-zinc-700 transition-colors shrink-0">
                {product.category.name}
              </a>
              <ChevronRight className="w-3 h-3 shrink-0 text-zinc-200" />
              <span className="text-zinc-600 truncate max-w-[160px] sm:max-w-none font-semibold">
                {product.name}
              </span>
            </nav>
          </AnimateOnView>
        </div>
      </div>

      {/* ── Main product grid ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 pb-6 lg:pt-12 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">

          {/* Gallery */}
          <AnimateOnView className="lg:col-span-7">
            <ProductGallery
              mainImage={product.image}
              supplementalImages={(product as any).images || []}
              productName={product.name}
              isNew={product.isNew}
              isBestSeller={product.isBestSeller}
            />
          </AnimateOnView>

          {/* Info Panel */}
          <AnimateOnView delay={0.1} className="lg:col-span-5">
            <div className="lg:sticky lg:top-6 space-y-6">

              {/* Identity */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    {product.subCategory || product.category.name}
                  </span>
                  {product.isNew && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 rounded-md">
                      New
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-brand text-white px-2 py-0.5 rounded-md">
                      Best Seller
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 leading-[1.15]">
                  {product.name}
                </h1>

                {product.description && (
                  <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-baseline flex-wrap gap-2.5">
                  <span className="text-3xl font-black tracking-tight text-zinc-950">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-base text-zinc-400 line-through font-medium">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                {product.discount > 0 && (
                  <p className="text-xs font-bold text-emerald-600 mt-1.5">
                    You save ₹{savings.toLocaleString("en-IN")}
                  </p>
                )}
                <p className="text-[10px] text-zinc-400 font-medium mt-1.5 uppercase tracking-wider">
                  Inclusive of all taxes · Free shipping above ₹499
                </p>
              </div>

              <Separator className="bg-zinc-100" />

              {/* Selection */}
              <ProductSelection product={product as any} />

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: ShieldCheck, label: "100% Genuine", sub: "Verified" },
                  { icon: Truck,       label: "Fast Delivery", sub: "2–4 Days" },
                  { icon: RotateCcw,   label: "Easy Returns",  sub: "7-Day Policy" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-2 py-3.5 px-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <Icon className="w-4 h-4 text-zinc-800" />
                    <div>
                      <p className="text-[9px] font-black text-zinc-900 uppercase tracking-tight leading-tight">{label}</p>
                      <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery strip */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-100 bg-zinc-50">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-800">
                    Order within <span className="text-brand font-bold">4 hrs 23 mins</span> — get it by{" "}
                    <span className="text-brand font-bold">Tomorrow, 10 AM</span>
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Express dispatch from Jaipur warehouse</p>
                </div>
              </div>

            </div>
          </AnimateOnView>
        </div>
      </div>

      {/* ── Details Section ── */}
      <div className="border-t border-zinc-100 bg-zinc-50/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 lg:py-20">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left: Description + Features */}
            <AnimateOnView className="lg:col-span-7 space-y-10">

              {/* Description */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1 h-5 rounded-full bg-zinc-900 block shrink-0" />
                  <h2 className="text-xl font-black tracking-tight text-zinc-950">About this product</h2>
                </div>
                <p className="text-sm text-zinc-500 leading-[1.9] whitespace-pre-wrap">
                  {product.description ||
                    "Every creation is a masterpiece of modern design and premium craftsmanship. This item represents a commitment to excellence, blending comfort with a sophisticated aesthetic that transcends trends."}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-1 h-5 rounded-full bg-zinc-900 block shrink-0" />
                    <h3 className="text-xl font-black tracking-tight text-zinc-950">Key Highlights</h3>
                  </div>
                  <ul className="space-y-3">
                    {product.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                        </span>
                        <span className="text-sm text-zinc-600 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AnimateOnView>

            {/* Right: Spec Card */}
            <AnimateOnView delay={0.1} className="lg:col-span-5">
              <div className="lg:sticky lg:top-8 rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-sm">

                {/* Card header */}
                <div className="bg-zinc-950 px-6 py-5">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.25em]">
                    Product Specifications
                  </p>
                  <p className="text-white font-bold text-sm mt-1 line-clamp-2 leading-snug">
                    {product.name}
                  </p>
                </div>

                {/* Spec rows */}
                <div className="divide-y divide-zinc-100">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-zinc-50 transition-colors">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">
                        {spec.label}
                      </span>
                      <span className="text-xs font-bold text-zinc-900 text-right leading-snug max-w-[60%]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card footer */}
                <div className="bg-zinc-50 border-t border-zinc-100 px-6 py-3.5">
                  <p className="text-[10px] text-zinc-400 font-medium">
                    All products are quality-checked before dispatch.
                  </p>
                </div>
              </div>
            </AnimateOnView>

          </div>
        </div>
      </div>

    </div>
  );
}
