import React from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

async function getCategories() {
  return await prisma.category.findMany();
}

export default async function ProductsAdminPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="space-y-6 sm:space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-zinc-900 px-1">Inventory</h1>
          <p className="text-zinc-500 font-medium px-2 leading-relaxed">Curate and manage your premium collection items.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-brand hover:bg-brand/90 text-white gap-2 rounded-2xl h-14 px-8 shadow-lg shadow-brand/20 transition-transform active:scale-95 font-bold">
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[32px] border border-zinc-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products, SKUs, or categories..." 
            className="w-full pl-12 pr-6 py-4 bg-zinc-50/50 border-0 rounded-2xl text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-brand/10 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2 rounded-2xl h-[56px] border-zinc-100 hover:bg-zinc-50 font-bold px-8 shadow-sm">
            <Filter className="w-4 h-4 text-zinc-400" />
            Filter
          </Button>
        </div>
      </div>

      {/* Products Table Wrapper for Responsive Scrolling */}
      <div className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden relative group">
        <div className="overflow-x-auto no-scrollbar scroll-smooth">
          <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-full">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="p-6 sm:p-8 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-8">Product Details</th>
                <th className="p-6 sm:p-8 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-8 hidden md:table-cell">Collection</th>
                <th className="p-6 sm:p-8 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-8">Pricing</th>
                <th className="p-6 sm:p-8 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 sm:p-32 text-center space-y-8">
                    <div className="w-24 h-24 bg-zinc-50 rounded-[40px] flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl shadow-zinc-200/50">
                      <Package className="w-10 h-10 text-zinc-200" />
                    </div>
                    <div>
                      <p className="font-bold text-2xl text-zinc-900">Your inventory is empty</p>
                      <p className="text-zinc-400 font-medium max-w-xs mx-auto mt-2 text-sm leading-relaxed">Experience reality by adding your first luxury product.</p>
                    </div>
                    <Link href="/admin/products/new">
                      <Button className="bg-brand hover:bg-brand/90 text-white gap-2 rounded-2xl h-14 px-10 shadow-lg shadow-brand/20 mt-4 transition-transform hover:scale-105 active:scale-95">
                        <Plus className="w-5 h-5" />
                        Create First Product
                      </Button>
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="group/row hover:bg-zinc-50/40 transition-colors border-b border-zinc-50 last:border-0 font-medium h-24 sm:h-32">
                    <td className="p-4 sm:p-8 px-6 sm:px-8">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] sm:rounded-[28px] overflow-hidden bg-zinc-100 shrink-0 border-2 border-white shadow-lg shadow-zinc-200/40 relative">
                           <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                           <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/row:scale-110" />
                        </div>
                        <div>
                          <p className="text-zinc-900 text-base sm:text-lg font-bold group-hover/row:text-brand transition-colors line-clamp-1">{p.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight tabular-nums">#{p.id.slice(-6).toUpperCase()}</p>
                             <div className="md:hidden flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-zinc-200" />
                                <p className="text-[10px] text-brand font-bold uppercase tracking-tight">{p.category.name}</p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-8 px-8 hidden md:table-cell">
                       <div className="space-y-2">
                        <div className="inline-flex items-center px-4 py-1.5 bg-zinc-50 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-wider border border-zinc-100 shadow-sm">
                          {p.category.name}
                        </div>
                        <div className="flex gap-2">
                           {p.isBestSeller && <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-sm shadow-brand/50" title="Bestseller" />}
                           {p.isNew && <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 shadow-sm shadow-zinc-900/50" title="New Arrival" />}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-8 px-8">
                      <div className="space-y-1">
                        <p className="font-bold text-lg sm:text-xl text-zinc-900 font-heading tracking-tight tabular-nums">₹{p.price}</p>
                        {p.discount > 0 && (
                          <div className="flex items-center gap-2">
                             <p className="text-[10px] text-zinc-300 line-through tabular-nums decoration-brand/30">₹{p.originalPrice}</p>
                             <p className="text-[9px] text-brand font-bold uppercase tracking-tighter bg-brand/5 px-2 py-0.5 rounded-full border border-brand/5">{p.discount}% OFF</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 sm:p-8 px-8">
                      <div className="flex items-center justify-end gap-2 sm:gap-3">
                         <Link href={`/admin/products/${p.id}/edit`}>
                            <Button variant="ghost" size="icon" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl hover:bg-brand/5 hover:text-brand transition-all active:scale-90 border border-transparent hover:border-brand/10 shadow-sm hover:shadow-brand/5">
                              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                         </Link>
                         <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {products.length > 0 && (
          <div className="p-6 sm:p-8 bg-zinc-50/50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">Synchronized with live Supabase node ({products.length} Items)</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 border-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all hover:border-zinc-200">Previous</Button>
              <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 w-10 border-brand text-brand shadow-lg shadow-brand/10 bg-white">1</Button>
              <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 border-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all hover:border-zinc-200">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
