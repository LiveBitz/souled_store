"use client";

import React, { useEffect, useState } from "react";
import { 
  Layers, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { getCategories, updateCategoryImage } from "@/lib/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleUpdateImage = async (id: string, newUrl: string) => {
    setUpdatingId(id);
    const result = await updateCategoryImage(id, newUrl);
    
    if (result.success) {
      toast({
        title: "Visual Assets Synchronized",
        description: "The category image has been professionally updated.",
      });
      // Update local state
      setCategories(prev => prev.map(c => c.id === id ? { ...c, image: newUrl } : c));
    } else {
      toast({
        title: "Synchronization Error",
        description: result.error as string,
        variant: "destructive",
      });
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <p className="text-zinc-500 font-bold text-sm tracking-tight animate-pulse">Orchestrating Visual Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Orchestration */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand/5 rounded-2xl flex items-center justify-center">
               <Layers className="w-5 h-5 text-brand" />
             </div>
             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight text-zinc-900">
               Visual Console
             </h1>
          </div>
          <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xl">
             Manage your flagship&apos;s <span className="text-zinc-900 font-bold underline decoration-brand/30">Category Orchestration</span>. 
             Update visuals in real-time using image addresses.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={fetchCategories}
          className="h-12 rounded-2xl border-zinc-100 hover:bg-zinc-50 font-extrabold text-zinc-900 shadow-sm gap-2 transition-all active:scale-95"
        >
          <RefreshCw className={cn("w-4 h-4 text-zinc-400", loading && "animate-spin")} />
          Sync Dataset
        </Button>
      </div>

      {/* Grid Orchestration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
        {categories.map((cat) => (
          <CategoryCard 
            key={cat.id} 
            category={cat} 
            isUpdating={updatingId === cat.id}
            onUpdate={handleUpdateImage}
          />
        ))}
      </div>

      {categories.length === 0 && (
        <div className="py-24 text-center bg-white rounded-[48px] border border-zinc-100 shadow-sm flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl">
              <Layers className="w-9 h-9 text-zinc-200" />
            </div>
            <p className="font-extrabold text-xl text-zinc-900">No categories found in the flagship.</p>
        </div>
      )}
    </div>
  );
}

function CategoryCard({ category, onUpdate, isUpdating }: { category: any, onUpdate: (id: string, url: string) => void, isUpdating: boolean }) {
  const [tempUrl, setTempUrl] = useState(category.image || "");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setTempUrl(category.image || "");
    setIsModified(false);
  }, [category.image]);

  return (
    <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500 flex flex-col h-full">
      {/* Visual Preview */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50">
        {tempUrl ? (
          <img 
            src={tempUrl} 
            alt={category.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as any).src = "https://placehold.co/600/400/f4f4f5/9ca3af?text=Invalid+Image+Address";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100">
               <ImageIcon className="w-6 h-6 text-zinc-300" />
             </div>
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">No Visual Assigned</p>
          </div>
        )}
        <div className="absolute top-4 left-4">
           <span className="bg-zinc-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
             {category.name}
           </span>
        </div>
      </div>

      {/* Orchestration Controls */}
      <div className="p-6 space-y-5 flex-1 flex flex-col">
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">
             Asset Orchestration (Image Address)
          </label>
          <div className="relative group/input">
             <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within/input:text-brand transition-colors" />
             <Input 
               value={tempUrl}
               onChange={(e) => {
                 setTempUrl(e.target.value);
                 setIsModified(e.target.value !== category.image);
               }}
               placeholder="e.g. https://domain.com/image.jpg"
               className="h-12 pl-12 rounded-2xl border-zinc-100 bg-zinc-50/30 text-xs font-bold text-zinc-900 focus:bg-white transition-all shadow-sm"
             />
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between gap-4">
           <div className="flex items-center gap-2">
             {isModified ? (
               <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                 <AlertCircle className="w-3 h-3" />
                 Unsaved Changes
               </div>
             ) : (
               <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                 <CheckCircle2 className="w-3 h-3" />
                 Synchronized
               </div>
             )}
           </div>

           <Button
             disabled={!isModified || isUpdating}
             onClick={() => onUpdate(category.id, tempUrl)}
             className={cn(
               "rounded-2xl h-11 px-6 font-bold text-xs uppercase tracking-widest transition-all",
               isModified 
                 ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-200 active:scale-95" 
                 : "bg-zinc-50 text-zinc-300"
             )}
           >
             {isUpdating ? (
               <Loader2 className="w-4 h-4 animate-spin" />
             ) : (
               <div className="flex items-center gap-2">
                 <Save className="w-4 h-4" />
                 Save Visual
               </div>
             )}
           </Button>
        </div>
      </div>
    </div>
  );
}
