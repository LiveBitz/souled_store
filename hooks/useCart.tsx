"use client";

import { useState, useCallback, useMemo } from "react";
import { CartItem, mockCartItems } from "@/lib/cartData";
import { useToast } from "@/hooks/use-toast";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(mockCartItems);
  const { toast } = useToast();

  const updateQuantity = useCallback((id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.stock, item.quantity + delta)),
            }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    const itemToRemove = items.find(i => i.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    
    toast({
      title: "Item removed from cart",
      description: `${itemToRemove?.name} has been removed.`,
      action: (
        // Mock undo logic - in real scenario would restore from temp var
        <button 
          onClick={() => itemToRemove && setItems(prev => [...prev, itemToRemove])}
          className="text-xs font-black uppercase tracking-widest underline underline-offset-4"
        >
          Undo
        </button>
      ),
    });
  }, [items, toast]);

  const updateSize = useCallback((id: number, size: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, size } : item))
    );
    toast({
      title: "Size updated",
      description: `Updated to ${size}`,
    });
  }, [toast]);

  const stats = useMemo(() => {
    const mrpTotal = items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
    const discountTotal = items.reduce((sum, i) => sum + (i.originalPrice - i.price) * i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFree = subtotal >= 499;
    const total = deliveryFree ? subtotal : subtotal + 49;
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      mrpTotal,
      discountTotal,
      subtotal,
      deliveryFree,
      total,
      itemCount,
    };
  }, [items]);

  return {
    items,
    updateQuantity,
    removeItem,
    updateSize,
    ...stats,
  };
}
