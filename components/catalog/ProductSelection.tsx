"use client";

import React, { useState } from "react";
import { ShoppingBag, Heart, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProductSelectionProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    sizes: string[];
    colors: string[];
  };
}

export function ProductSelection({ product }: ProductSelectionProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;

  const handleAddToCart = () => {
    const isSizeMissing = hasSizes && !selectedSize;
    const isColorMissing = hasColors && !selectedColor;

    if (isSizeMissing || isColorMissing) {
      setShowError(true);
      // Reset error after 3s
      setTimeout(() => setShowError(false), 3000);
      return;
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
              showError && !selectedSize ? "text-rose-500" : "text-zinc-400"
            )}>
              Select Archetype (Size)
            </p>
            <button className="text-[10px] font-bold text-zinc-400 underline underline-offset-4 hover:text-zinc-900 transition-colors uppercase tracking-widest">
              Scale Matrix
            </button>
          </div>

          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-3">
            {product.sizes.map((sizeData: string) => {
              const [size, qtyStr] = sizeData.split(":");
              const quantity = parseInt(qtyStr || "0");
              const isOutOfStock = quantity === 0;
              const isSelected = selectedSize === size;

              return (
                <button
                  key={size}
                  disabled={isOutOfStock}
                  onClick={() => {
                    setSelectedSize(size);
                    setShowError(false);
                  }}
                  className={cn(
                    "relative group h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 overflow-hidden",
                    isOutOfStock
                      ? "bg-zinc-50 border-zinc-100 text-zinc-200 cursor-not-allowed"
                      : isSelected
                      ? "bg-zinc-950 border-zinc-950 text-white shadow-xl shadow-zinc-200"
                      : "bg-white border-zinc-100 text-zinc-900 hover:border-zinc-200 active:scale-95"
                  )}
                >
                  <span className="text-[13px] font-black tracking-tight z-10">
                    {size}
                  </span>
                  {isOutOfStock && (
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
            showError && !selectedColor ? "text-rose-500" : "text-zinc-400"
          )}>
            Visual Palette (Color)
          </p>
          <div className="flex flex-wrap gap-4">
            {product.colors.map((color: string) => (
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

      {/* ── Call to Action ── */}
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex gap-3">
          <Button 
            onClick={handleAddToCart}
            className="flex-1 h-16 rounded-[2rem] bg-zinc-950 hover:bg-zinc-800 text-white font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-zinc-200 transition-all duration-300 active:scale-95 gap-3 group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            Add to Collective
          </Button>
          <Button
            variant="outline"
            className="h-16 w-16 rounded-full border-zinc-100 hover:border-rose-100 hover:bg-rose-50/50 hover:text-rose-500 transition-all duration-300 active:scale-90 flex items-center justify-center p-0 shrink-0"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          className="w-full h-14 rounded-full border-zinc-100 text-zinc-900 font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all duration-300 active:scale-95"
        >
          Express Procurement (Buy Now)
        </Button>
      </div>
    </div>
  );
}
