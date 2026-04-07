"use client";

import React, { useState, useRef } from "react";
import { X, Image as ImageIcon, Check, Loader2, Upload, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBanner, updateBanner } from "@/lib/actions/banner-actions";
import { Banner } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface BannerFormProps {
  banner?: Banner | null;
  allBanners: Banner[];
  navData?: {
    categories: { label: string; value: string }[];
    products: { label: string; value: string }[];
    fixed: { label: string; value: string }[];
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function BannerForm({ banner, allBanners, navData, onClose, onSuccess }: BannerFormProps) {
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    image: banner?.image || "",
    link: banner?.link || "/",
    type: banner?.type || "HERO",
    order: banner?.order || 1,
    isActive: banner?.isActive ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = banner
        ? await updateBanner(banner.id, formData)
        : await createBanner(formData);

      if (res.success) {
        toast({
          title: banner ? "Banner updated" : "Banner created",
          description: banner
            ? "Your changes have been saved."
            : "New banner added to storefront.",
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from("banner")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      const {
        data: { publicUrl },
      } = supabase.storage.from("banner").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image: publicUrl }));
      setUploadProgress(100);
      
      toast({
        title: "Visual asset synchronized",
        description: "Image successfully uploaded to cloud storage.",
      });
    } catch (error: any) {
      console.error("Error uploading banner image:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Verify 'banner' bucket permissions.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Dynamic Validation Logic
  const bannersOfType = allBanners.filter(b => b.type === formData.type);
  const isEditingSameType = banner?.type === formData.type;
  const maxOrder = bannersOfType.length + (isEditingSameType ? 0 : 1);

  // Premium Stepper logic
  const adjustOrder = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      order: Math.min(maxOrder, Math.max(1, prev.order + delta))
    }));
  };

  return (
    /*
     * Overlay
     * – covers full viewport
     * – centres the modal on all screen sizes
     * – allows scroll on very small screens via overflow-y-auto
     */
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-zinc-950/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      {/*
       * Modal card
       * – max-w-2xl on large screens, full-width on mobile
       * – rounded corners scale down on small screens
       * – flex-col so header / body / footer stack cleanly
       */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl sm:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-zinc-100 flex flex-col my-auto animate-in zoom-in-95 duration-500">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 px-6 py-6 sm:px-10 sm:py-8 border-b border-zinc-50 bg-zinc-50/30">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight leading-tight">
              {banner ? "Refine Visual Asset" : "Orchestrate New Banner"}
            </h2>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 font-bold uppercase tracking-widest px-0.5">
              Banner Orchestration Console
            </p>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 p-3 rounded-full border border-zinc-100 bg-white text-zinc-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 hover:rotate-90 transition-all duration-300 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-8 sm:px-10 sm:py-10 space-y-10 max-h-[60vh] sm:max-h-[65vh] custom-scrollbar">

          {/* Image Preview */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">
              Asset Visualization
            </Label>

            <div 
              className="relative w-full overflow-hidden rounded-[2rem] border-2 border-dashed border-zinc-100 bg-zinc-50 group/preview transition-colors hover:border-zinc-200 cursor-pointer"
              style={{ aspectRatio: "21/9" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {formData.image ? (
                <>
                  <Image
                    src={formData.image}
                    alt="Banner preview"
                    fill
                    className="object-cover transition-transform duration-700 group-hover/preview:scale-105"
                  />
                  {/* Hover overlay to clear/change image */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/preview:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-white/90 text-zinc-900 px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl border-none hover:scale-105 active:scale-95 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 mr-2" />
                      Swap Media Asset
                    </Button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-zinc-300 px-10 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm group-hover/preview:scale-110 transition-transform">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-brand animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-zinc-200" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 italic">
                      {isUploading ? `Synchronizing Media... ${uploadProgress}%` : "Drop Visual Asset Here"}
                    </p>
                    <p className="text-[9px] text-zinc-300 font-medium">Click to browse your local files</p>
                  </div>
                </div>
              )}

              {/* Progress bar overlay if uploading */}
              {isUploading && (
                <div className="absolute bottom-0 left-0 h-1.5 bg-zinc-100 w-full overflow-hidden">
                  <div 
                    className="h-full bg-brand transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">
                Manual Override (Source URL)
              </Label>
              <Input
                placeholder="https://..."
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="h-12 rounded-xl bg-zinc-50 border-zinc-100 text-[11px] font-mono placeholder:text-zinc-300 focus:border-zinc-300 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label
                htmlFor="title"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1"
              >
                Primary Title <span className="text-zinc-300 px-1">•</span> <span className="text-rose-500 font-bold scale-110 inline-block">Req</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Summer Drop '26"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-14 rounded-2xl border-zinc-100 text-sm font-bold tracking-tight bg-white focus:border-zinc-300 transition-all shadow-sm"
                required
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="subtitle"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1"
              >
                Supporting Subtitle
              </Label>
              <Input
                id="subtitle"
                placeholder="e.g. Minimalism re-defined"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="h-14 rounded-2xl border-zinc-100 text-sm font-medium tracking-tight bg-white focus:border-zinc-300 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Type & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">
                Orchestration Category
              </Label>
              <Select
                value={formData.type}
                onValueChange={(val) =>
                  setFormData({ ...formData, type: val })
                }
              >
                <SelectTrigger className="h-14 w-full flex rounded-2xl border-zinc-100 bg-white text-sm font-bold tracking-tight px-4 shadow-sm transition-all focus:border-zinc-300 overflow-hidden">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-800 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1.5 z-[70] min-w-[280px]">
                  <SelectItem
                    value="HERO"
                    className="rounded-xl text-xs font-bold uppercase tracking-widest py-3 cursor-pointer transition-colors text-zinc-400 focus:bg-zinc-800 focus:text-white"
                  >
                    Hero — Prime Slideshow
                  </SelectItem>
                  <SelectItem
                    value="PROMO"
                    className="rounded-xl text-xs font-bold uppercase tracking-widest py-3 cursor-pointer transition-colors text-zinc-400 focus:bg-zinc-800 focus:text-white"
                  >
                    Promo — Structural Strip
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label
                className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1"
              >
                Navigation Strategy (Link)
              </Label>
              <Select
                value={formData.link}
                onValueChange={(val) =>
                  setFormData({ ...formData, link: val })
                }
              >
                <SelectTrigger className="h-14 w-full flex rounded-2xl border-zinc-100 bg-white text-sm font-mono font-medium px-4 shadow-sm transition-all focus:border-zinc-300 overflow-hidden">
                  <SelectValue placeholder="Select target route" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-800 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1.5 z-[70] min-w-[280px]">
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-3 px-3">Curated Navigation</SelectLabel>
                    <SelectItem value="/category/men" className="rounded-xl text-[11px] font-bold tracking-tight py-3 text-zinc-300 focus:bg-zinc-800 focus:text-white">
                      Men
                    </SelectItem>
                    <SelectItem value="/category/watches" className="rounded-xl text-[11px] font-bold tracking-tight py-3 text-zinc-300 focus:bg-zinc-800 focus:text-white">
                      Watches
                    </SelectItem>
                    <SelectItem value="/category/perfumes" className="rounded-xl text-[11px] font-bold tracking-tight py-3 text-zinc-300 focus:bg-zinc-800 focus:text-white">
                      Perfumes
                    </SelectItem>
                    <SelectItem value="/category/accessories" className="rounded-xl text-[11px] font-bold tracking-tight py-3 text-zinc-300 focus:bg-zinc-800 focus:text-white">
                      Accessories
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <Label
                htmlFor="order"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400"
              >
                Display Order
              </Label>
              <span className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest">
                Priority Ranking
              </span>
            </div>

            <div className="flex items-stretch gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => adjustOrder(-1)}
                className="w-14 h-14 rounded-2xl border-zinc-100 bg-zinc-50 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 active:scale-95 transition-all shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <div className="relative flex-1">
                <Input
                  id="order"
                  type="number"
                  placeholder="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: Math.min(maxOrder, Math.max(1, parseInt(e.target.value) || 1)),
                    })
                  }
                  className="h-14 rounded-2xl border-zinc-100 text-center text-sm font-bold tracking-tight bg-white focus:border-zinc-300 transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                  <Check className="w-4 h-4 text-zinc-950" />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => adjustOrder(1)}
                className="w-14 h-14 rounded-2xl border-zinc-100 bg-zinc-50 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 hover:border-emerald-100 active:scale-95 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-[10px] text-zinc-400 px-1 leading-relaxed">
              Define priority between **1 and {maxOrder}** for the current category.
            </p>
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div className="px-5 py-4 sm:px-8 sm:py-5 border-t border-zinc-100 bg-zinc-50/60 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl font-semibold text-xs uppercase tracking-widest text-zinc-500 border-zinc-200 hover:bg-white hover:text-zinc-900 active:scale-95 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-[2] h-11 rounded-xl bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 active:scale-95 transition-all gap-2.5 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                Saving…
              </>
            ) : (
              <>
                <Check className="w-4 h-4 shrink-0" />
                {banner ? "Save Changes" : "Create Banner"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}