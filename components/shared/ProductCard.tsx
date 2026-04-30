"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { getTotalStock } from "@/lib/inventory";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: number | string;
    name: string;
    slug: string;
    category: any;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    stock?: number;
    sizes?: string[];
    isNew?: boolean;
    isBestSeller?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const totalStock = getTotalStock(product.sizes);
  const isOutOfStock = totalStock === 0;
  const wishlisted = isWishlisted(String(product.id));

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingToWishlist(true);
    try {
      await toggleWishlist(String(product.id));
      const after = isWishlisted(String(product.id));
      toast({
        title: after ? "Added to Wishlist" : "Removed from Wishlist",
        description: after
          ? `${product.name} has been added to your wishlist`
          : `${product.name} has been removed from your wishlist`,
        duration: 2000,
      });
    } catch (error: any) {
      const msg = error.message || "Failed to update wishlist";
      toast({
        title: msg.includes("login") ? "Login Required" : "Error",
        description: msg.includes("login")
          ? "Please login to add items to your wishlist"
          : msg,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className="group flex flex-col bg-white border border-zinc-100 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-200 hover:shadow-lg">

      {/* ── Image ── */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square block overflow-hidden bg-zinc-50">
        <Image
          src={imgError ? "https://picsum.photos/seed/error/600/600" : product.image}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-[1.04]",
            isOutOfStock && "opacity-50"
          )}
          onError={() => setImgError(true)}
          quality={75}
          loading="lazy"
        />

        {/* Hover overlay — "Shop Now" strip */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 h-10 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">Shop Now</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/40 backdrop-blur-[2px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-300 rounded-full px-3 py-1 bg-white">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlistClick}
          disabled={isAddingToWishlist}
          className={cn(
            "absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-50",
            wishlisted
              ? "bg-brand text-white shadow-md shadow-brand/30"
              : "bg-white/90 text-zinc-400 border border-zinc-200 hover:border-brand hover:text-brand"
          )}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-3.5 h-3.5 transition-all", wishlisted && "fill-white stroke-white")} />
        </button>

        {/* Discount badge — top left */}
        {product.discount > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
              {product.discount}% off
            </span>
          </div>
        )}
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-col gap-2.5 p-3 flex-1">

        {/* Name + NEW badge inline */}
        <Link href={`/product/${product.slug}`}>
          <div className="flex items-start gap-1.5">
            <h3 className="font-semibold text-[13px] text-zinc-800 line-clamp-2 leading-snug group-hover:text-brand transition-colors flex-1">
              {product.name}
            </h3>
            {product.isNew && (
              <span className="shrink-0 text-[8px] font-black uppercase tracking-wider bg-zinc-900 text-white px-1.5 py-0.5 rounded-md mt-0.5">
                New
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1.5 tabular-nums">
            <span className="text-base font-black text-zinc-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through font-medium">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </Link>

        {/* Add to Cart button */}
        <Link href={`/product/${product.slug}`} className="mt-auto">
          <button
            disabled={isOutOfStock}
            className={cn(
              "w-full h-9 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98]",
              isOutOfStock
                ? "bg-zinc-50 text-zinc-300 border border-zinc-100 cursor-not-allowed"
                : "bg-zinc-900 text-white hover:bg-brand border border-zinc-900 hover:border-brand"
            )}
          >
            <ShoppingBag className="w-3 h-3" />
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </Link>

      </div>
    </div>
  );
}
