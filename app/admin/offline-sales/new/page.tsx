import { OfflineSaleForm } from "@/components/admin/OfflineSaleForm";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

async function getProducts() {
  return prisma.product.findMany({
    where: { stock: { gt: 0 } },
    select: { id: true, name: true, price: true, image: true },
    orderBy: { name: "asc" },
  });
}

export default async function NewOfflineSalePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-50/50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/admin/offline-sales"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 font-bold mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Offline Sales
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Record Offline Sale
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manually enter an in-store sale
        </p>
      </div>

      <div className="max-w-4xl">
        <OfflineSaleForm products={products} />
      </div>
    </div>
  );
}
