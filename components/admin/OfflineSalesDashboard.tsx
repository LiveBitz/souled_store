"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { deleteOfflineSale } from "@/app/admin/actions/offline-sales";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Calendar,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader2,
  ReceiptText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SaleItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

type Sale = {
  id: string;
  saleNumber: string;
  customerName: string | null;
  customerPhone: string | null;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  notes: string | null;
  soldBy: string | null;
  saleDate: string;
  items: SaleItem[];
};

type Stats = {
  totalRevenue: number;
  totalCount: number;
  avgSaleValue: number;
  todayRevenue: number;
  todayCount: number;
  chartData: { date: string; revenue: number; count: number }[];
  paymentBreakdown: { method: string; count: number; revenue: number }[];
};

type Pagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const PAYMENT_COLORS: Record<string, string> = {
  cash: "bg-emerald-500",
  upi: "bg-blue-500",
  card: "bg-purple-500",
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
};

const PAYMENT_BADGE: Record<string, string> = {
  cash: "bg-emerald-50 text-emerald-700 border-emerald-100",
  upi: "bg-blue-50 text-blue-700 border-blue-100",
  card: "bg-purple-50 text-purple-700 border-purple-100",
};

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          {label}
        </p>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-zinc-900 tracking-tight">
        {value}
      </p>
      {sub && <p className="text-xs text-zinc-400 mt-1 font-medium">{sub}</p>}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-lg px-3 py-2.5 text-sm">
      <p className="font-bold text-zinc-900 mb-1">{label}</p>
      <p className="text-brand font-bold">{fmt(payload[0]?.value || 0)}</p>
      <p className="text-zinc-400 text-xs">{payload[1]?.value || 0} sales</p>
    </div>
  );
}

export function OfflineSalesDashboard({
  initialSales,
  initialPagination,
  initialStats,
}: {
  initialSales: Sale[];
  initialPagination: Pagination;
  initialStats: Stats;
}) {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const hasFilters = search || payment || from || to;

  const fetchSales = useCallback(
    async (opts: {
      search?: string;
      payment?: string;
      from?: string;
      to?: string;
      page?: number;
      withStats?: boolean;
    }) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (opts.search) params.set("search", opts.search);
        if (opts.payment) params.set("payment", opts.payment);
        if (opts.from) params.set("from", opts.from);
        if (opts.to) params.set("to", opts.to);
        params.set("page", String(opts.page || 1));
        if (opts.withStats) params.set("stats", "1");

        const res = await fetch(`/api/admin/offline-sales?${params}`);
        const text = await res.text();
        if (!text) throw new Error(`Empty response (status ${res.status})`);
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        setSales(data.sales ?? []);
        setPagination(data.pagination ?? null);
        if (data.stats) setStats(data.stats);
      } catch (err) {
        console.error("[fetchSales]", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchSales({ search, payment, from, to, page: 1 });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, payment, from, to]);

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchSales({ search, payment, from, to, page: p });
  };

  const clearFilters = () => {
    setSearch("");
    setPayment("");
    setFrom("");
    setTo("");
    setPage(1);
    fetchSales({ page: 1, withStats: true });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this sale record? This cannot be undone.")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteOfflineSale(id);
      await fetchSales({ search, payment, from, to, page, withStats: true });
      setDeletingId(null);
    });
  };

  const totalPaymentRevenue = stats.paymentBreakdown.reduce(
    (s, p) => s + p.revenue,
    0
  );

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Sales"
          value={String(stats.totalCount)}
          sub="all time"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={fmt(stats.totalRevenue)}
          sub="all time"
          color="bg-brand/10 text-brand"
        />
        <StatCard
          icon={Calendar}
          label="Today"
          value={fmt(stats.todayRevenue)}
          sub={`${stats.todayCount} sale${stats.todayCount !== 1 ? "s" : ""}`}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. Sale"
          value={fmt(stats.avgSaleValue)}
          sub="per transaction"
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Chart + Payment Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-zinc-900">Revenue — Last 7 Days</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Offline sales trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={stats.chartData}
              barCategoryGap="30%"
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f4f4f5"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                }
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f4f4f5" }} />
              <Bar
                dataKey="revenue"
                fill="#E84A4A"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
              <Bar
                dataKey="count"
                fill="#fecaca"
                radius={[6, 6, 0, 0]}
                maxBarSize={0}
                hide
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
          <h3 className="font-bold text-zinc-900 mb-1">Payment Methods</h3>
          <p className="text-xs text-zinc-400 mb-6">Revenue split</p>

          {stats.paymentBreakdown.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">
              No data yet
            </p>
          ) : (
            <div className="space-y-4">
              {stats.paymentBreakdown.map((p) => {
                const pct =
                  totalPaymentRevenue > 0
                    ? (p.revenue / totalPaymentRevenue) * 100
                    : 0;
                return (
                  <div key={p.method}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-zinc-700 capitalize">
                        {PAYMENT_LABELS[p.method] || p.method}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-zinc-900">
                          {fmt(p.revenue)}
                        </span>
                        <span className="text-xs text-zinc-400 ml-1.5">
                          {p.count} sale{p.count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          PAYMENT_COLORS[p.method] || "bg-zinc-400"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-zinc-100">
        {/* Table Header / Filters */}
        <div className="p-5 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sales, customers…"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400"
              />
            </div>

            {/* Payment filter */}
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="h-10 px-3 rounded-xl border border-zinc-200 text-sm text-zinc-700 outline-none focus:border-brand/50 bg-white cursor-pointer"
            >
              <option value="">All Payments</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>

            {/* Date range */}
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-10 px-2 rounded-xl border border-zinc-200 text-sm text-zinc-700 outline-none focus:border-brand/50 bg-white"
              />
              <span className="text-zinc-300 text-sm">—</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-10 px-2 rounded-xl border border-zinc-200 text-sm text-zinc-700 outline-none focus:border-brand/50 bg-white"
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="h-10 px-3 rounded-xl border border-zinc-200 text-sm text-zinc-500 hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}

            <Link
              href="/admin/offline-sales/new"
              className="ml-auto flex items-center gap-2 h-10 px-4 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand/90 transition-all shadow-sm shadow-brand/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Sale
            </Link>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-zinc-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ReceiptText className="w-10 h-10 text-zinc-200 mb-3" />
            <p className="font-bold text-zinc-400">No offline sales found</p>
            <p className="text-sm text-zinc-400 mt-1">
              {hasFilters
                ? "Try clearing your filters"
                : "Record your first offline sale"}
            </p>
            {!hasFilters && (
              <Link
                href="/admin/offline-sales/new"
                className="mt-4 flex items-center gap-2 h-10 px-5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand/90 transition-all"
              >
                <Plus className="w-4 h-4" />
                New Sale
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {[
                      "Sale #",
                      "Customer",
                      "Items",
                      "Total",
                      "Payment",
                      "Date",
                      "Sold By",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-bold text-zinc-400 uppercase tracking-wider px-5 py-3.5"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {sales.map((sale) => {
                    const isExpanded = expandedId === sale.id;
                    return (
                      <React.Fragment key={sale.id}>
                        <tr
                          className="hover:bg-zinc-50/50 transition-colors cursor-pointer"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : sale.id)
                          }
                        >
                          <td className="px-5 py-4 font-mono text-xs font-bold text-zinc-600">
                            {sale.saleNumber}
                          </td>
                          <td className="px-5 py-4">
                            {sale.customerName ? (
                              <div>
                                <p className="font-bold text-zinc-800">
                                  {sale.customerName}
                                </p>
                                {sale.customerPhone && (
                                  <p className="text-xs text-zinc-400">
                                    {sale.customerPhone}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-zinc-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-zinc-600">
                            {sale.items.length} item
                            {sale.items.length !== 1 ? "s" : ""}
                          </td>
                          <td className="px-5 py-4 font-bold text-zinc-900">
                            {fmt(sale.total)}
                            {sale.discount > 0 && (
                              <p className="text-xs font-medium text-emerald-600">
                                −{fmt(sale.discount)} off
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border capitalize",
                                PAYMENT_BADGE[sale.paymentMethod] ||
                                  "bg-zinc-50 text-zinc-600 border-zinc-100"
                              )}
                            >
                              {PAYMENT_LABELS[sale.paymentMethod] ||
                                sale.paymentMethod}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-zinc-500 text-xs">
                            {new Date(sale.saleDate).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short", year: "numeric" }
                            )}
                          </td>
                          <td className="px-5 py-4 text-zinc-500 text-sm">
                            {sale.soldBy || "—"}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedId(isExpanded ? null : sale.id);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(sale.id);
                                }}
                                disabled={deletingId === sale.id || isPending}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-300 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50"
                              >
                                {deletingId === sale.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded items row */}
                        {isExpanded && (
                          <tr>
                            <td
                              colSpan={8}
                              className="bg-zinc-50/80 px-5 py-4 border-t border-zinc-100"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
                                <div>
                                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                                    Items
                                  </p>
                                  <div className="space-y-2">
                                    {sale.items.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center justify-between text-sm"
                                      >
                                        <span className="text-zinc-700">
                                          {item.productName}{" "}
                                          <span className="text-zinc-400">
                                            ×{item.quantity}
                                          </span>
                                        </span>
                                        <span className="font-bold text-zinc-800">
                                          {fmt(item.total)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {sale.notes && (
                                  <div className="sm:max-w-xs">
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                      Notes
                                    </p>
                                    <p className="text-sm text-zinc-600 bg-white rounded-xl px-3 py-2 border border-zinc-100">
                                      {sale.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-zinc-50">
              {sales.map((sale) => {
                const isExpanded = expandedId === sale.id;
                return (
                  <div key={sale.id} className="p-4">
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : sale.id)
                      }
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-mono text-xs font-bold text-zinc-500">
                            {sale.saleNumber}
                          </p>
                          <p className="font-bold text-zinc-900 mt-0.5">
                            {sale.customerName || "Walk-in Customer"}
                          </p>
                          {sale.customerPhone && (
                            <p className="text-xs text-zinc-400">
                              {sale.customerPhone}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-zinc-900">
                            {fmt(sale.total)}
                          </p>
                          <span
                            className={cn(
                              "inline-flex mt-1 px-2 py-0.5 rounded-lg text-xs font-bold border capitalize",
                              PAYMENT_BADGE[sale.paymentMethod] ||
                                "bg-zinc-50 text-zinc-600 border-zinc-100"
                            )}
                          >
                            {PAYMENT_LABELS[sale.paymentMethod] ||
                              sale.paymentMethod}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>
                          {new Date(sale.saleDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {sale.soldBy && ` · ${sale.soldBy}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <span>
                            {sale.items.length} item
                            {sale.items.length !== 1 ? "s" : ""}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-zinc-100 space-y-3">
                        <div className="space-y-1.5">
                          {sale.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-zinc-600">
                                {item.productName}{" "}
                                <span className="text-zinc-400">
                                  ×{item.quantity}
                                </span>
                              </span>
                              <span className="font-bold text-zinc-800">
                                {fmt(item.total)}
                              </span>
                            </div>
                          ))}
                          {sale.discount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-zinc-400">Discount</span>
                              <span className="font-bold text-emerald-600">
                                −{fmt(sale.discount)}
                              </span>
                            </div>
                          )}
                        </div>
                        {sale.notes && (
                          <p className="text-xs text-zinc-500 bg-zinc-50 rounded-lg px-3 py-2">
                            {sale.notes}
                          </p>
                        )}
                        <button
                          onClick={() => handleDelete(sale.id)}
                          disabled={deletingId === sale.id || isPending}
                          className="w-full h-9 flex items-center justify-center gap-1.5 rounded-xl border border-rose-100 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-all disabled:opacity-50"
                        >
                          {deletingId === sale.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-100">
                <p className="text-xs text-zinc-400">
                  Showing {(pagination.page - 1) * pagination.pageSize + 1}–
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total
                  )}{" "}
                  of {pagination.total}
                </p>
                <div className="flex gap-1.5">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                        page === i + 1
                          ? "bg-brand text-white"
                          : "text-zinc-500 hover:bg-zinc-100"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
