"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOfflineSale } from "@/app/admin/actions/offline-sales";
import {
  Plus,
  Trash2,
  ChevronDown,
  AlertCircle,
  Loader2,
  IndianRupee,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type SaleItem = {
  localId: string;
  isCustom: boolean;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
];

let itemCounter = 1;
const newItem = (): SaleItem => ({
  localId: String(++itemCounter),
  isCustom: false,
  productId: "",
  productName: "",
  price: 0,
  quantity: 1,
});

function ProductSelector({
  products,
  value,
  onChange,
}: {
  products: Product[];
  value: string;
  onChange: (p: Product) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = products.find((p) => p.id === value);
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 h-11 px-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-700 hover:border-zinc-300 transition-colors"
      >
        <span className={cn("truncate", !selected && "text-zinc-400")}>
          {selected ? selected.name : "Select product…"}
        </span>
        <ChevronDown className="w-4 h-4 shrink-0 text-zinc-400" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-zinc-200 bg-white shadow-lg overflow-hidden">
            <div className="p-2 border-b border-zinc-100">
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-zinc-50">
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-3 py-3 text-xs text-zinc-400 text-center">
                  No products found
                </p>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onChange(p);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-zinc-50 transition-colors text-left",
                      p.id === value && "bg-brand/5 text-brand"
                    )}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-xs text-zinc-500 ml-2 shrink-0">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function OfflineSaleForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [soldBy, setSoldBy] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<SaleItem[]>([newItem()]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const updateItem = (localId: string, patch: Partial<SaleItem>) =>
    setItems((prev) =>
      prev.map((i) => (i.localId === localId ? { ...i, ...patch } : i))
    );

  const removeItem = (localId: string) =>
    setItems((prev) => prev.filter((i) => i.localId !== localId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const hasEmpty = items.some((i) => !i.productName.trim() || i.price <= 0);
    if (hasEmpty) {
      setError("All items must have a name and a valid price.");
      return;
    }

    startTransition(async () => {
      const result = await createOfflineSale({
        customerName,
        customerPhone,
        items: items.map((i) => ({
          productId: i.productId || undefined,
          productName: i.productName,
          price: i.price,
          quantity: i.quantity,
        })),
        discount,
        paymentMethod,
        notes,
        soldBy,
        saleDate,
      });

      if (result.success) {
        router.push("/admin/offline-sales");
        router.refresh();
      } else {
        setError(result.error || "Something went wrong.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer + Sale Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-4">
          <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wider">
            Customer
            <span className="ml-1.5 text-zinc-400 font-normal normal-case tracking-normal">
              (optional)
            </span>
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
                className="w-full h-11 px-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full h-11 px-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* Sale Info */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-4">
          <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wider">
            Sale Info
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                Sale Date
              </label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full h-11 px-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                Sold By
              </label>
              <input
                type="text"
                value={soldBy}
                onChange={(e) => setSoldBy(e.target.value)}
                placeholder="Staff name"
                className="w-full h-11 px-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wider">
            Items
          </h3>
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, newItem()])}
            className="flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {/* Header row — desktop */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_100px_110px_36px] gap-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
            <span>Type / Product</span>
            <span>Item Name</span>
            <span>Price (₹)</span>
            <span>Qty</span>
            <span />
          </div>

          {items.map((item, idx) => (
            <div
              key={item.localId}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_110px_36px] gap-3 items-start p-4 md:p-0 rounded-xl md:rounded-none bg-zinc-50 md:bg-transparent border border-zinc-100 md:border-0"
            >
              {/* Type toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateItem(item.localId, {
                      isCustom: false,
                      productId: "",
                      productName: "",
                      price: 0,
                    })
                  }
                  className={cn(
                    "flex-1 h-11 rounded-xl text-xs font-bold border transition-all",
                    !item.isCustom
                      ? "bg-brand text-white border-brand shadow-sm"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                  )}
                >
                  Catalog
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateItem(item.localId, {
                      isCustom: true,
                      productId: "",
                      productName: "",
                      price: 0,
                    })
                  }
                  className={cn(
                    "flex-1 h-11 rounded-xl text-xs font-bold border transition-all",
                    item.isCustom
                      ? "bg-brand text-white border-brand shadow-sm"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                  )}
                >
                  Custom
                </button>
              </div>

              {/* Name field */}
              <div className="md:contents">
                <div className="md:col-span-1">
                  {item.isCustom ? (
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) =>
                        updateItem(item.localId, { productName: e.target.value })
                      }
                      placeholder="Item name"
                      className="w-full h-11 px-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400 bg-white"
                    />
                  ) : (
                    <ProductSelector
                      products={products}
                      value={item.productId}
                      onChange={(p) =>
                        updateItem(item.localId, {
                          productId: p.id,
                          productName: p.name,
                          price: p.price,
                        })
                      }
                    />
                  )}
                </div>

                {/* Price */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={item.price || ""}
                    onChange={(e) =>
                      updateItem(item.localId, {
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="w-full h-11 pl-7 pr-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400 bg-white"
                  />
                </div>

                {/* Quantity + line total */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-white h-11">
                    <button
                      type="button"
                      onClick={() =>
                        updateItem(item.localId, {
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      }
                      className="w-9 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 text-lg font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-zinc-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateItem(item.localId, { quantity: item.quantity + 1 })
                      }
                      className="w-9 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 text-lg font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {item.price > 0 && (
                    <span className="text-xs font-bold text-zinc-500 whitespace-nowrap">
                      = ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => items.length > 1 && removeItem(item.localId)}
                  disabled={items.length === 1}
                  className="self-center h-11 w-9 flex items-center justify-center rounded-xl text-zinc-300 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment + Notes */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-4">
          <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wider">
            Payment
          </h3>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
              Method
            </label>
            <div className="flex gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setPaymentMethod(m.value)}
                  className={cn(
                    "flex-1 h-11 rounded-xl text-sm font-bold border transition-all",
                    paymentMethod === m.value
                      ? "bg-brand text-white border-brand shadow-sm"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
              Discount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                min={0}
                max={subtotal}
                value={discount || ""}
                onChange={(e) =>
                  setDiscount(Math.max(0, parseFloat(e.target.value) || 0))
                }
                placeholder="0"
                className="w-full h-11 pl-7 pr-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any remarks…"
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400 resize-none"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 flex flex-col">
          <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wider mb-5">
            Summary
          </h3>

          <div className="flex-1 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">
                Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
              </span>
              <span className="font-bold text-zinc-900">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Discount</span>
                <span className="font-bold text-emerald-600">
                  −₹{discount.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <div className="pt-3 mt-3 border-t border-zinc-100 flex justify-between">
              <span className="font-bold text-zinc-900">Total</span>
              <span className="text-2xl font-extrabold text-brand">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || total <= 0}
              className="w-full h-12 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recording…
                </>
              ) : (
                <>
                  <IndianRupee className="w-4 h-4" />
                  Record Sale
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
              className="w-full h-11 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-zinc-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
