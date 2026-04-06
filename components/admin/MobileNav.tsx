"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AdminSidebarContent } from "@/components/admin/AdminSidebarContent";

export function MobileNav() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by ensuring the client-side component 
  // only renders after the initial mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl border border-zinc-100 opacity-50">
        <Menu className="w-6 h-6 text-zinc-900" />
      </Button>
    );
  }

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-zinc-50 border border-zinc-100 transition-all">
            <Menu className="w-6 h-6 text-zinc-900" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 rounded-r-[40px] border-r-0 shadow-2xl">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation</SheetTitle>
          </SheetHeader>
          <AdminSidebarContent />
        </SheetContent>
      </Sheet>
    </div>
  );
}
