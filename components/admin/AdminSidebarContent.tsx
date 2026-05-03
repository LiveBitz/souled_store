"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
  Store,
  Users,
  ReceiptText,
  Tag,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Banners", href: "/admin/banners", icon: Store },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Offline Sales", href: "/admin/offline-sales", icon: ReceiptText },
  { label: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebarContent() {
  const pathname = usePathname();
  const isOfflineSalesSection = pathname.startsWith("/admin/offline-sales");

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 pb-4">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20 transition-transform group-hover:scale-105">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold font-heading text-lg leading-tight tracking-tight text-zinc-900">Admin</h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Dashboard v1.0</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href) && item.href === "/admin/offline-sales"
              ? pathname === item.href
              : false);
          const isExactActive = pathname === item.href;
          return (
            <React.Fragment key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all group",
                  isExactActive
                    ? "text-brand bg-brand/5 shadow-sm shadow-brand/5"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isExactActive ? "text-brand" : "text-zinc-400"
                )} />
                <span className="flex-1">{item.label}</span>
                {isExactActive ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>

              {/* Sub-items for Offline Sales */}
              {item.href === "/admin/offline-sales" && isOfflineSalesSection && (
                <>
                  <Link
                    href="/admin/offline-sales/tags"
                    className={cn(
                      "flex items-center gap-3 pl-11 pr-4 py-2.5 rounded-2xl font-bold transition-all group text-sm",
                      pathname === "/admin/offline-sales/tags"
                        ? "text-brand bg-brand/5"
                        : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
                    )}
                  >
                    <Tag className={cn(
                      "w-4 h-4 transition-transform group-hover:scale-110",
                      pathname === "/admin/offline-sales/tags" ? "text-brand" : "text-zinc-300"
                    )} />
                    <span className="flex-1">Item Tags</span>
                    {pathname === "/admin/offline-sales/tags" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    )}
                  </Link>
                  <Link
                    href="/admin/offline-sales/brand-tags"
                    className={cn(
                      "flex items-center gap-3 pl-11 pr-4 py-2.5 rounded-2xl font-bold transition-all group text-sm",
                      pathname === "/admin/offline-sales/brand-tags"
                        ? "text-violet-600 bg-violet-50"
                        : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
                    )}
                  >
                    <Bookmark className={cn(
                      "w-4 h-4 transition-transform group-hover:scale-110",
                      pathname === "/admin/offline-sales/brand-tags" ? "text-violet-500" : "text-zinc-300"
                    )} />
                    <span className="flex-1">Brand Tags</span>
                    {pathname === "/admin/offline-sales/brand-tags" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    )}
                  </Link>
                </>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <div className="p-6 mt-auto space-y-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-5 py-4 rounded-2xl text-zinc-600 font-bold bg-zinc-50 hover:bg-zinc-100 transition-all group border border-zinc-100"
        >
          <Store className="w-5 h-5" />
          <span>View Store</span>
        </Link>
        
        <button
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-rose-500 font-bold hover:bg-rose-50 transition-all group"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
