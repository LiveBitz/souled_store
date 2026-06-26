"use client";

import React, { useState } from "react";
import { ArrowUpDown, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
  { label: "Best Discount", value: "discount" },
];

export function SortDropdown({ sortBy, setSortBy }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const currentSort = sortOptions.find(o => o.value === sortBy);

  const handleSortSelect = (value: string) => {
    setSortBy(value);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="w-full h-[52px] rounded-none bg-white hover:bg-zinc-50 active:bg-zinc-100 flex items-center justify-center gap-2 transition-colors duration-150 px-2 min-w-0">
          <ArrowUpDown className="w-[18px] h-[18px] text-zinc-700 shrink-0" />
          <span className="text-sm font-semibold text-zinc-900 shrink-0">Sort</span>
          <span className="text-xs font-medium text-zinc-400 truncate">· {currentSort?.label}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl p-0 bg-white border-none">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-zinc-100">
          <SheetTitle className="text-xl font-bold tracking-tight text-zinc-900">Sort By</SheetTitle>
        </SheetHeader>
        <div className="py-3 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-1 max-h-[60vh] overflow-y-auto">
          {sortOptions.map((option) => {
            const active = sortBy === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full flex items-center justify-between text-left px-4 py-3.5 rounded-xl font-medium transition-colors ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200"
                }`}
              >
                <span className="text-[15px]">{option.label}</span>
                {active && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
