"use client";

import React, { useState, useMemo } from "react";
import { ShoppingBag, Heart, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getTotalStock, 
  extractBaseSizes, 
  getAvailableColorsForSize 
} from "@/lib/inventory";

interface ProductSelectionProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
    sizes: string[];
    colors: string[];
  };
}

export function ProductSelection({ product }: ProductSelectionProps) {
  const { addItem, setIsOpen: setCartOpen } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Use shared utility for consistent extraction
  const cleanSizes = useMemo(() => extractBaseSizes(product.sizes), [product.sizes]);
  const hasSizes = cleanSizes.length > 0;
  
  // Get available colors: if size selected, filter by size; otherwise show all
  const availableColors = useMemo(() => {
    if (!selectedSize) {
      // No size selected: show all colors from product.colors
      return product.colors;
    }
    
    // Size selected: get colors for that specific size
    const colorsForSize = getAvailableColorsForSize(product.sizes, selectedSize);
    
    // If no colors found for this size (old format data), fall back to all colors
    if (colorsForSize.length === 0) {
      return product.colors;
    }
    
    return colorsForSize;
  }, [selectedSize, product.sizes, product.colors]);

  const hasColors = availableColors.length > 0;

  const handleAddToCart = (): boolean => {
    const isSizeMissing = hasSizes && !selectedSize;
    const isColorMissing = hasColors && !selectedColor;

    if (isSizeMissing || isColorMissing) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return false;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });

    setShowError(false);
    return true;
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) {
      // Open the cart sheet so the customer can proceed to checkout
      setCartOpen(true);
    }
  };

  const handleWishlistClick = async () => {
    setIsAddingToWishlist(true);

    try {
      await toggleWishlist(product.id);
      const wishlisted = isWishlisted(product.id);
      
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
    <div className="space-y-10">
      {/* ── Selection Validation Feedback ── */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
              <Info className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-tight">
                {hasSizes && !selectedSize && hasColors && !selectedColor
                  ? "Please select Size and Color"
                  : hasSizes && !selectedSize
                  ? "Please select a Size"
                  : "Please select a Color"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sizes ── */}
      {hasSizes && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className={cn(
              "text-[11px] font-black uppercase tracking-[0.2em] transition-colors",
              showError && !selectedSize ? "text-rose-500" : "text-zinc-500"
            )}>
              Select Size
              {selectedSize && <span className="text-zinc-900"> · {selectedSize}</span>}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {cleanSizes.map((size: string) => {
              const isSelected = selectedSize === size;

              // Check if this size has any inventory.
              // Matches "S-Black:5" (size-color) AND "100ml:5" (size-only, e.g. perfumes)
              const hasInventory = product.sizes.some((entry: string) =>
                entry.startsWith(size + "-") || entry.startsWith(size + ":")
              );

              return (
                <button
                  key={size}
                  disabled={!hasInventory}
                  onClick={() => {
                    setSelectedSize(size);
                    setSelectedColor(null); // Reset color when size changes
                    setShowError(false);
                  }}
                  className={cn(
                    "relative group h-12 min-w-[3rem] px-4 rounded-xl border-2 flex items-center justify-center transition-all duration-300 overflow-hidden",
                    !hasInventory
                      ? "bg-zinc-50 border-zinc-100 text-zinc-200 cursor-not-allowed"
                      : isSelected
                      ? "bg-zinc-950 border-zinc-950 text-white shadow-md"
                      : "bg-white border-zinc-200 text-zinc-900 hover:border-zinc-400 active:scale-95"
                  )}
                >
                  <span className="text-[13px] font-black tracking-tight z-10">
                    {size}
                  </span>
                  {!hasInventory && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="block w-[140%] h-0.5 bg-zinc-200/50 rotate-[35deg]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Colors ── */}
      {hasColors && (
        <div className="space-y-5">
          <p className={cn(
            "text-[11px] font-black uppercase tracking-[0.2em] transition-colors",
            showError && !selectedColor ? "text-rose-500" : "text-zinc-500"
          )}>
            Select Color
            {selectedColor && <span className="text-zinc-900"> · {selectedColor}</span>}
          </p>
          <div className="flex flex-wrap gap-4">
            {availableColors.map((color: string) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setShowError(false);
                }}
                className={cn(
                  "group relative w-11 h-11 rounded-full border-2 transition-all duration-300 active:scale-90",
                  selectedColor === color 
                    ? "border-zinc-900 ring-4 ring-zinc-100" 
                    : "border-transparent ring-1 ring-zinc-200 hover:ring-zinc-400"
                )}
              >
                <span 
                  className="absolute inset-1 rounded-full shadow-inner"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                {selectedColor === color && (
                  <Check className={cn(
                    "absolute inset-0 m-auto w-4 h-4 z-10",
                    color.toLowerCase() === 'white' || color.toLowerCase() === '#ffffff' ? "text-zinc-900" : "text-white"
                  )} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Call to Action (inline) ── */}
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            className="flex-1 h-14 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs sm:text-sm uppercase tracking-[0.15em] shadow-xl shadow-zinc-200/70 transition-all duration-300 active:scale-[0.98] gap-2.5 group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            Add to Cart
          </Button>
          <Button
            onClick={handleWishlistClick}
            disabled={isAddingToWishlist}
            aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "h-14 w-14 sm:h-16 sm:w-16 rounded-2xl sm:rounded-full transition-all duration-300 active:scale-90 flex items-center justify-center p-0 shrink-0",
              isWishlisted(product.id)
                ? "border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-500 border"
                : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 hover:text-rose-400 border text-zinc-400"
            )}
          >
            <Heart className={cn(
              "w-5 h-5 transition-colors stroke-zinc-900",
              isWishlisted(product.id) && "fill-rose-500 stroke-rose-500"
            )} />
          </Button>
        </div>

        <Button
          onClick={handleBuyNow}
          className="w-full h-14 rounded-2xl sm:rounded-full bg-brand hover:bg-brand/90 text-white font-black text-xs sm:text-sm uppercase tracking-[0.15em] transition-all duration-300 active:scale-[0.98]"
        >
          Buy Now
        </Button>
      </div>

      {/* ── Mobile Sticky CTA Bar ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-lg font-black text-zinc-950 leading-none">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            {product.originalPrice && product.discount && product.discount > 0 && (
              <p className="text-[10px] text-zinc-400 line-through font-medium mt-0.5">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <Button
            onClick={handleWishlistClick}
            disabled={isAddingToWishlist}
            aria-label="Toggle wishlist"
            className={cn(
              "h-12 w-12 rounded-xl border shrink-0 flex items-center justify-center p-0 transition-all active:scale-90",
              isWishlisted(product.id)
                ? "border-rose-200 bg-rose-50 text-rose-500"
                : "border-zinc-200 bg-white text-zinc-500"
            )}
          >
            <Heart className={cn("w-5 h-5", isWishlisted(product.id) && "fill-rose-500 stroke-rose-500")} />
          </Button>
          <Button
            onClick={handleBuyNow}
            className="flex-1 h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.15em] active:scale-[0.98] gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
