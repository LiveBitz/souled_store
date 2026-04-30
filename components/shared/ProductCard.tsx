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

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingToWishlist(true);
    try {
      await toggleWishlist(String(product.id));
      const wishlisted = isWishlisted(String(product.id));
      toast({
        title: wishlisted ? "Added to Wishlist" : "Removed from Wishlist",
        description: wishlisted
          ? `${product.name} has been added to your wishlist`
          : `${product.name} has been removed from your wishlist`,
        duration: 2000,
      });
    } catch (error: any) {
      const errorMsg = error.message || "Failed to update wishlist";
      if (errorMsg.includes("login")) {
        toast({
          title: "Login Required",
          description: "Please login to add items to your wishlist",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
          duration: 2000,
        });
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-zinc-100 block"
      >
        <Image
          src={imgError ? "https://picsum.photos/seed/error/600/600" : product.image}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            isOutOfStock && "opacity-60"
          )}
          onError={() => setImgError(true)}
          quality={75}
          loading="lazy"
        />

        {/* Wishlist */}
        <button
          onClick={handleWishlistClick}
          disabled={isAddingToWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 z-10"
          aria-label={isWishlisted(String(product.id)) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted(String(product.id))
                ? "fill-brand stroke-brand"
                : "stroke-zinc-400"
            )}
          />
        </button>

        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discount > 0 && (
            <span className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-zinc-900 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className="bg-zinc-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-3 flex-1">
        <Link href={`/product/${product.slug}`} className="flex-1">
          <h3 className="font-bold text-sm text-zinc-800 line-clamp-1 group-hover:text-brand transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-1.5 tabular-nums">
            <span className="font-extrabold text-base text-zinc-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </Link>

        <Link href={`/product/${product.slug}`} className="block">
          <button
            disabled={isOutOfStock}
            className={cn(
              "w-full h-10 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200",
              isOutOfStock
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                : "bg-zinc-100 text-zinc-700 hover:bg-brand hover:text-white active:scale-[0.98]"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </Link>
      </div>
    </div>
  );
}
