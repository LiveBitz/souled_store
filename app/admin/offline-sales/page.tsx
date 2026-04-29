import { OfflineSalesDashboard } from "@/components/admin/OfflineSalesDashboard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getInitialData() {
  const PAGE_SIZE = 15;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const chartStart = new Date();
  chartStart.setDate(chartStart.getDate() - 6);
  chartStart.setHours(0, 0, 0, 0);

  const [sales, total, allStats, todayStats, chartSales, paymentStats] =
    await Promise.all([
      prisma.offlineSale.findMany({
        include: { items: true },
        orderBy: { saleDate: "desc" },
        take: PAGE_SIZE,
      }),
      prisma.offlineSale.count(),
      prisma.offlineSale.aggregate({
        _sum: { total: true },
        _count: { id: true },
        _avg: { total: true },
      }),
      prisma.offlineSale.aggregate({
        where: { saleDate: { gte: today, lte: todayEnd } },
        _sum: { total: true },
        _count: { id: true },
      }),
      prisma.offlineSale.findMany({
        where: { saleDate: { gte: chartStart } },
        select: { saleDate: true, total: true },
      }),
      prisma.offlineSale.groupBy({
        by: ["paymentMethod"],
        _sum: { total: true },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
    ]);

  const chartData: { date: string; revenue: number; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    const daySales = chartSales.filter(
      (s) =>
        new Date(s.saleDate) >= dayStart && new Date(s.saleDate) <= dayEnd
    );
    chartData.push({
      date: label,
      revenue: daySales.reduce((s, sale) => s + sale.total, 0),
      count: daySales.length,
    });
  }

  return {
    sales: JSON.parse(JSON.stringify(sales)),
    pagination: {
      total,
      page: 1,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
    stats: {
      totalRevenue: allStats._sum.total ?? 0,
      totalCount: allStats._count.id,
      avgSaleValue: allStats._avg.total ?? 0,
      todayRevenue: todayStats._sum.total ?? 0,
      todayCount: todayStats._count.id,
      chartData,
      paymentBreakdown: paymentStats.map((p) => ({
        method: p.paymentMethod,
        count: p._count.id,
        revenue: p._sum.total ?? 0,
      })),
    },
  };
}

export default async function OfflineSalesPage() {
  const { sales, pagination, stats } = await getInitialData();

  return (
    <div className="min-h-screen bg-zinc-50/50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Offline Sales
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage and track in-store sales manually
          </p>
        </div>
        <Link
          href="/admin/offline-sales/new"
          className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand/90 active:scale-95 transition-all shadow-sm shadow-brand/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Sale</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      <OfflineSalesDashboard
        initialSales={sales}
        initialPagination={pagination}
        initialStats={stats}
      />
    </div>
  );
}
