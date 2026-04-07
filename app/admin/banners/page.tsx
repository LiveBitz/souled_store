"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Image as ImageIcon, ExternalLink, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  getAllBanners, 
  deleteBanner, 
  toggleBannerStatus,
  updateBanner,
  getNavigationLinks
} from "@/lib/actions/banner-actions";
import { Banner } from "@prisma/client";
import { BannerForm } from "@/components/admin/BannerForm";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [navData, setNavData] = useState<{
    categories: { label: string; value: string }[];
    products: { label: string; value: string }[];
    fixed: { label: string; value: string }[];
  }>({ categories: [], products: [], fixed: [] });
  const { toast } = useToast();

  const fetchBanners = async () => {
    setIsLoading(true);
    const data = await getAllBanners();
    setBanners(data);
    setIsLoading(false);
  };

  const fetchNavData = async () => {
    const res = await getNavigationLinks();
    if (res.success) {
      setNavData({
        categories: res.categories || [],
        products: res.products || [],
        fixed: res.fixed || [],
      });
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchNavData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      const res = await deleteBanner(id);
      if (res.success) {
        toast({ title: "Banner deleted", description: "The banner has been removed." });
        fetchBanners();
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await toggleBannerStatus(id, !currentStatus);
    if (res.success) {
      toast({ title: "Status updated", description: `Banner is now ${!currentStatus ? "active" : "inactive"}.` });
      fetchBanners();
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setEditingBanner(null);
    setIsFormOpen(true);
  };

  const handleOrderChange = async (banner: Banner, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= banners.length) return;
    
    const targetBanner = banners[targetIndex];
    
    // Swap orders
    await updateBanner(banner.id, { order: targetBanner.order });
    await updateBanner(targetBanner.id, { order: banner.order });
    
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-zinc-50/30 font-sans selection:bg-zinc-950 selection:text-white">
      <div className="container mx-auto py-12 px-6 sm:px-10 lg:px-12 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-1000">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 mb-16">
          <div className="space-y-2 text-left">
            <h1 className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tighter leading-none">
              Banner Orchestration
            </h1>
            <p className="text-[11px] sm:text-[12px] font-bold text-zinc-400 uppercase tracking-[0.25em]">
              Storefront Visual Architecture Module
            </p>
          </div>
          <Button 
            onClick={handleNew}
            className="w-full sm:w-auto h-16 px-10 rounded-[2rem] bg-zinc-950 text-white hover:bg-zinc-800 font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 active:scale-95 group gap-4 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] ring-1 ring-white/10"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            Create New Asset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 pb-32">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="aspect-[21/9] rounded-2xl bg-zinc-100 animate-pulse" />
            ))
          ) : banners.length === 0 ? (
            <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-8 text-center bg-white rounded-3xl border border-zinc-100 shadow-sm transition-all hover:shadow-xl">
              <div className="w-24 h-24 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center rotate-3 hover:rotate-12 transition-transform duration-500">
                <ImageIcon className="w-10 h-10 text-zinc-200" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-zinc-950 tracking-tight">Empty Visual Repository</p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest max-w-[240px]">Initialize your storefront with high-fidelity hero assets.</p>
              </div>
              <Button onClick={handleNew} className="rounded-full px-8 h-12 bg-zinc-950 text-white font-black uppercase tracking-widest text-[9px] hover:scale-105 active:scale-95 transition-all">Initialize Repository</Button>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className={cn(
                "group relative bg-white rounded-2xl border border-zinc-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden",
                !banner.isActive && "bg-zinc-50"
              )}>
                {/* Visual Overlay for Order */}
                <div className="absolute top-6 right-6 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                  <button 
                    onClick={() => handleOrderChange(banner, 'up')}
                    className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-zinc-100 text-zinc-950 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all disabled:opacity-0" 
                    disabled={banners.indexOf(banner) === 0}
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleOrderChange(banner, 'down')}
                    className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-zinc-100 text-zinc-950 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all disabled:opacity-0"
                    disabled={banners.indexOf(banner) === banners.length - 1}
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Asset Visualization */}
                <div className={cn(
                  "relative aspect-[21/9] w-full overflow-hidden transition-opacity duration-500",
                  !banner.isActive && "opacity-60"
                )}>
                  <Image 
                    src={banner.image} 
                    alt={banner.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-60" />
                </div>

                {/* Metadata & Orchestration */}
                <div className="p-8 sm:p-10 space-y-8">
                  <div className={cn(
                    "space-y-2 transition-all duration-500",
                    !banner.isActive && "opacity-60"
                  )}>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">{banner.type}</span>
                      <div className="h-px flex-1 bg-zinc-50" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-950 tracking-tighter leading-tight line-clamp-1">{banner.title}</h3>
                    <p className="text-xs font-medium text-zinc-400 line-clamp-1">{banner.subtitle || "No supporting subtitle provided."}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-50 relative z-30">
                    <div className="flex items-center gap-1.5 opacity-100">
                      <button 
                        onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-sm",
                          banner.isActive 
                            ? "bg-zinc-100/80 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 hover:shadow-rose-100" 
                            : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95"
                        )}
                      >
                        {banner.isActive ? "Disable Asset" : "Activate Asset"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 opacity-100">
                      <button 
                        onClick={() => handleEdit(banner)}
                        className="w-12 h-12 rounded-xl bg-zinc-50 text-zinc-950 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all shadow-sm group/btn active:scale-90"
                      >
                        <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.id)}
                        className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm group/del active:scale-90"
                      >
                        <Trash2 className="w-4 h-4 group-hover/del:rotate-12 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      {isFormOpen && (
        <BannerForm 
          banner={editingBanner}
          allBanners={banners}
          navData={navData}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBanner(null);
          }} 
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingBanner(null);
            fetchBanners();
          }}
        />
      )}
      </div>
    </div>
  );
}
