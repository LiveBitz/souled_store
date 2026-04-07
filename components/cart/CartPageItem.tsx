"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, Heart, ShieldCheck, Truck } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CartPageItemProps {
  item: CartItem;
}

export function CartPageItem({ item }: CartPageItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="group relative flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-3xl border border-zinc-100 hover:border-zinc-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">
      {/* ── High-Fidelity Asset ── */}
      <div className="relative w-24 h-32 sm:w-32 sm:h-40 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-50 shrink-0">
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
        />
        {/* Subtle Overlay Shadow */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* ── Content Orchestration ── */}
      <div className="flex-1 flex flex-col justify-between self-stretch py-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-zinc-950 truncate leading-tight tracking-tight">
                {item.name}
              </h4>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full bg-zinc-50 border border-zinc-100 text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                SKU_{item.productId.slice(-4).toUpperCase()}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {item.size && (
                <span className="text-[10px] sm:text-[11px] font-medium text-zinc-500 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-100">
                  Size: <span className="font-bold text-zinc-950">{item.size}</span>
                </span>
              )}
              {item.color && (
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-zinc-500 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-100">
                  Color: 
                  <span 
                    className="w-2.5 h-2.5 rounded-full ring-2 ring-white ring-offset-1" 
                    style={{ backgroundColor: item.color.toLowerCase(), boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }} 
                  />
                  <span className="font-bold text-zinc-950 capitalize">{item.color}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-base sm:text-lg font-black text-zinc-950 tracking-tight">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
            <p className="text-[10px] text-zinc-400 font-medium tracking-tight mt-0.5">
              ₹{item.price.toLocaleString("en-IN")} / Unit
            </p>
          </div>
        </div>

        {/* ── Interactive Footer Controls ── */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-center gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center bg-zinc-50/80 border border-zinc-100 rounded-2xl h-10 px-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateQuantity(item.id, -1)}
                className="w-8 h-8 rounded-xl hover:bg-white hover:text-zinc-950 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="w-10 text-center text-xs font-bold text-zinc-950 tabular-nums">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateQuantity(item.id, 1)}
                className="w-8 h-8 rounded-xl hover:bg-white hover:text-zinc-950 text-zinc-400 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Save for later / Wishlist integration placeholder */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-2xl text-zinc-300 hover:text-rose-500 hover:bg-rose-50/50 transition-all hidden sm:flex"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => removeItem(item.id)}
            className="h-10 px-4 rounded-2xl text-zinc-300 hover:text-rose-500 hover:bg-rose-50/50 transition-all flex items-center gap-2 group/remove"
          >
            <Trash2 className="w-4 h-4 group-hover/remove:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
