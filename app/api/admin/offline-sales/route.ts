import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    return !error && !!data.user;
  } catch {
    return false;
  }
}

const PAGE_SIZE = 15;

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyAdmin()))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const search = searchParams.get("search") || "";
    const payment = searchParams.get("payment") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const includeStats = searchParams.get("stats") === "1";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search } },
        { saleNumber: { contains: search, mode: "insensitive" } },
        { soldBy: { contains: search, mode: "insensitive" } },
      ];
    }

    if (payment) where.paymentMethod = payment;

    if (from || to) {
      where.saleDate = {};
      if (from) where.saleDate.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        where.saleDate.lte = toDate;
      }
    }

    const [sales, total] = await Promise.all([
      prisma.offlineSale.findMany({
        where,
        include: { items: true },
        orderBy: { saleDate: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.offlineSale.count({ where }),
    ]);

    let stats = null;
    if (includeStats) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const chartStart = new Date();
      chartStart.setDate(chartStart.getDate() - 6);
      chartStart.setHours(0, 0, 0, 0);

      const [allStats, todayStats, chartSales, paymentStats] = await Promise.all([
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
        const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
        const dayStart = new Date(d);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(d);
        dayEnd.setHours(23, 59, 59, 999);

        const daySales = chartSales.filter(
          (s) => new Date(s.saleDate) >= dayStart && new Date(s.saleDate) <= dayEnd
        );
        chartData.push({
          date: label,
          revenue: daySales.reduce((sum, s) => sum + s.total, 0),
          count: daySales.length,
        });
      }

      stats = {
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
      };
    }

    return NextResponse.json({
      sales,
      pagination: {
        total,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
      stats,
    });
  } catch (err) {
    console.error("[offline-sales GET]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
