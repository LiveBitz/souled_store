import React from "react";
import { 
  Menu,
  Settings,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSidebarContent } from "@/components/admin/AdminSidebarContent";
import { MobileNav } from "@/components/admin/MobileNav";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-zinc-50/10">
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex w-72 border-r border-zinc-100 bg-white flex-col sticky top-0 h-screen shrink-0 shadow-sm z-20">
        <AdminSidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Responsive Header */}
        <header className="h-20 lg:h-24 border-b border-zinc-100 bg-white/70 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Mobile Navigation Toggle */}
             <MobileNav />
             
             <div className="hidden sm:block">
               <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Management Portal</h2>
               <p className="text-sm font-bold text-zinc-900">Digital Flagship Store</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <Button variant="ghost" size="icon" className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl hover:bg-zinc-50 relative group">
              <Bell className="w-5 h-5 text-zinc-400 group-hover:text-brand transition-colors" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-brand rounded-full border-2 border-white" />
            </Button>
            
            <div className="h-10 w-px bg-zinc-100 hidden sm:block" />

            <div className="flex items-center gap-4 group cursor-pointer hover:bg-zinc-50/50 p-1 rounded-2xl transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-zinc-900 leading-tight">Admin User</p>
                <p className="text-[10px] text-brand font-bold uppercase tracking-tighter">Super Admin</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-500 shadow-sm overflow-hidden group-hover:border-brand/20 transition-all">
                <img 
                  src="https://api.dicebear.com/7.x/shapes/svg?seed=Admin&backgroundColor=f4f4f5" 
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Page */}
        <section className="p-4 sm:p-8 lg:p-12">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
