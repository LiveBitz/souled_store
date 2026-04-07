"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, TrendingUp, Package, ShoppingCart, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface DashboardData {
  month: number;
  year: number;
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalRevenue: number;
    newCustomers: number;
  };
  ordersByStatus: Record<string, number>;
  revenueChart: Array<{ date: string; revenue: number }>;
  topProducts: Array<{ name: string; quantity: number; value: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  shipped: "#06b6d4",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const REFRESH_INTERVAL = 5000; // 5 seconds auto-refresh

export default function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      console.log(`[Dashboard] Fetching data for ${MONTHS[selectedMonth]} ${selectedYear}`);
      const response = await fetch(
        `/api/admin/dashboard?month=${selectedMonth}&year=${selectedYear}`
      );
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const dashboardData = await response.json();
      console.log("[Dashboard] Data fetched:", dashboardData);
      setData(dashboardData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Unable to load dashboard data");
      console.error("[Dashboard] Fetch error:", err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  // Initial fetch and setup auto-refresh
  useEffect(() => {
    console.log("[Dashboard] Component mounted, starting auto-refresh");
    fetchDashboardData();

    // Set up auto-refresh interval
    const intervalId = setInterval(() => {
      console.log("[Dashboard] Auto-refresh tick");
      fetchDashboardData();
    }, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => {
      console.log("[Dashboard] Cleaning up interval");
      clearInterval(intervalId);
    };
  }, [selectedMonth, selectedYear]);

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) {
      return `${diffSecs}s ago`;
    }
    const diffMins = Math.floor(diffSecs / 60);
    return `${diffMins}m ago`;
  };

  if (error && !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600">
        {error}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Orders",
      value: data?.stats.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Revenue",
      value: `₹${(data?.stats.totalRevenue ?? 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Products",
      value: data?.stats.totalProducts ?? 0,
      icon: Package,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "New Customers",
      value: data?.stats.newCustomers ?? 0,
      icon: TrendingUp,
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const statusData = data
    ? Object.entries(data.ordersByStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        fill: STATUS_COLORS[status] || "#666",
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Month Selector with Live Indicator */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-900">
              {MONTHS[selectedMonth]} {selectedYear}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Updated {formatLastUpdated()}</p>
          </div>
        </div>
        
        <button
          onClick={fetchDashboardData}
          disabled={isRefreshing}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Refresh data"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`${card.color} border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-medium text-sm">{card.label}</h3>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart - spans 2 columns */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Revenue Trend - {MONTHS[selectedMonth]} {selectedYear}
              </h2>
              {data?.revenueChart && data.revenueChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={data.revenueChart}
                    key={`revenue-${JSON.stringify(data.revenueChart.map(d => d.revenue).join(','))}`}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      style={{ fontSize: "12px" }}
                      label={{ value: "Revenue (₹)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "8px",
                      }}
                      formatter={(value) => {
                        const numValue = typeof value === 'number' ? value : 0;
                        return [`₹${numValue.toLocaleString()}`, "Revenue"];
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      dot={{ fill: "#3b82f6", r: 4 }}
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                      name="Revenue"
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  No revenue data for this month
                </div>
              )}
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Orders by Status</h2>
              {statusData && statusData.length > 0 ? (
                <div className="space-y-4">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.fill }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 capitalize">{item.name}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-lg font-bold text-gray-900">{item.value}</span>
                        <p className="text-xs text-gray-500">order{item.value !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  No order data
                </div>
              )}
            </div>
          </div>

          {/* Top Products and Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Top Products Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-900">Top Products by Orders</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Units sold this month</p>
              </div>
              {data?.topProducts && data.topProducts.length > 0 ? (
                <div className="w-full">
                  {/* Mobile View (sm: below) */}
                  <div className="sm:hidden w-full overflow-x-auto -mx-4 px-4">
                    <div style={{ minWidth: "320px" }}>
                      <ResponsiveContainer width={320} height={240}>
                        <BarChart 
                          data={data.topProducts}
                          key={`products-mobile-${JSON.stringify(data.topProducts.map(d => d.quantity).join(','))}`}
                          margin={{ top: 8, right: 12, left: 20, bottom: 65 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#d1d5db"
                            angle={-60}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 8, fill: "#6b7280", fontWeight: 500 }}
                            interval={0}
                          />
                          <YAxis 
                            stroke="#d1d5db"
                            tick={{ fontSize: 9, fill: "#6b7280" }}
                            label={{ value: "Units", angle: -90, position: "insideLeft", fontSize: 8 }}
                            width={30}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              padding: "6px 8px",
                              fontSize: "10px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)"
                            }}
                            formatter={(value) => [value, "Units"]}
                            cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
                          />
                          <Bar 
                            dataKey="quantity" 
                            fill="#10b981" 
                            radius={[5, 5, 0, 0]}
                            isAnimationActive={true}
                            animationDuration={500}
                            maxBarSize={22}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Tablet View (sm: to lg:) */}
                  <div className="hidden sm:block lg:hidden w-full overflow-x-auto -mx-6 px-6">
                    <div style={{ minWidth: "450px" }}>
                      <ResponsiveContainer width={450} height={290}>
                        <BarChart 
                          data={data.topProducts}
                          key={`products-tablet-${JSON.stringify(data.topProducts.map(d => d.quantity).join(','))}`}
                          margin={{ top: 10, right: 15, left: 35, bottom: 95 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#9ca3af"
                            angle={-50}
                            textAnchor="end"
                            height={100}
                            tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 500 }}
                            interval={0}
                          />
                          <YAxis 
                            stroke="#9ca3af"
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                            label={{ value: "Units Sold", angle: -90, position: "insideLeft", fontSize: 10 }}
                            width={40}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "7px",
                              padding: "8px",
                              fontSize: "11px",
                              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)"
                            }}
                            formatter={(value) => [value, "Units"]}
                            cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
                          />
                          <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "11px" }} />
                          <Bar 
                            dataKey="quantity" 
                            fill="#10b981" 
                            radius={[6, 6, 0, 0]}
                            isAnimationActive={true}
                            animationDuration={600}
                            maxBarSize={35}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Desktop View (lg:+) */}
                  <div className="hidden lg:block w-full">
                    <ResponsiveContainer width="100%" height={360}>
                      <BarChart 
                        data={data.topProducts}
                        key={`products-desktop-${JSON.stringify(data.topProducts.map(d => d.quantity).join(','))}`}
                        margin={{ top: 12, right: 25, left: 50, bottom: 110 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={true} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9ca3af"
                          angle={-45}
                          textAnchor="end"
                          height={125}
                          tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                          interval={0}
                        />
                        <YAxis 
                          stroke="#9ca3af"
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          label={{ value: "Units Sold", angle: -90, position: "insideLeft", fontSize: 12, offset: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            fontSize: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)"
                          }}
                          formatter={(value) => [value, "Units"]}
                          labelFormatter={(label) => `Product: ${label}`}
                          cursor={{ fill: "rgba(16, 185, 129, 0.08)" }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
                          height={30}
                        />
                        <Bar 
                          dataKey="quantity" 
                          fill="#10b981" 
                          radius={[8, 8, 0, 0]}
                          isAnimationActive={true}
                          animationDuration={700}
                          maxBarSize={55}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-56 sm:h-72 lg:h-96 text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-100">
                  <Package className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-300 mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-600">No product data available</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1 px-4 text-center">Products will appear once orders are placed</p>
                </div>
              )}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-900">Recent Orders</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Latest transactions</p>
              </div>
              {data?.recentOrders && data.recentOrders.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
                  {data.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 sm:block">
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                            Order #{order.orderNumber}
                          </p>
                          <span
                            className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold capitalize text-white whitespace-nowrap sm:hidden"
                            style={{
                              backgroundColor: STATUS_COLORS[order.status.toLowerCase()] || "#f3f4f6",
                              color: STATUS_COLORS[order.status.toLowerCase()] ? "white" : "#374151",
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs sm:mt-1 truncate">{order.customerName}</p>
                        <p className="text-gray-400 text-xs mt-0.5 sm:mt-1">{order.createdAt}</p>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-2">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm">₹{order.total.toLocaleString()}</p>
                        <span
                          className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize text-white"
                          style={{
                            backgroundColor: STATUS_COLORS[order.status.toLowerCase()] || "#f3f4f6",
                            color: STATUS_COLORS[order.status.toLowerCase()] ? "white" : "#374151",
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-56 sm:h-72 lg:h-96 text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-100">
                  <ShoppingCart className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-300 mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-600">No recent orders</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1 px-4 text-center">Orders will appear here once customers purchase</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
