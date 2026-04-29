"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const verifyAdminAuth = async (): Promise<{ isValid: boolean; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return { isValid: false, error: "Unauthorized" };
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Authentication check failed" };
  }
};

function generateSaleNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `OS-${ts}-${rand}`;
}

export type OfflineSaleItemInput = {
  productId?: string;
  productName: string;
  quantity: number;
  price: number;
};

export type CreateOfflineSaleInput = {
  customerName?: string;
  customerPhone?: string;
  items: OfflineSaleItemInput[];
  discount?: number;
  paymentMethod: string;
  paymentStatus?: string;
  notes?: string;
  soldBy?: string;
  saleDate?: string;
};

export async function createOfflineSale(input: CreateOfflineSaleInput) {
  const auth = await verifyAdminAuth();
  if (!auth.isValid) return { success: false, error: auth.error };

  if (!input.items?.length)
    return { success: false, error: "At least one item is required" };

  for (const item of input.items) {
    if (!item.productName?.trim())
      return { success: false, error: "All items must have a name" };
    if (item.price <= 0)
      return { success: false, error: "All items must have a valid price" };
    if (item.quantity < 1)
      return { success: false, error: "Quantity must be at least 1" };
  }

  const subtotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = Math.max(0, input.discount || 0);
  const total = Math.max(0, subtotal - discount);

  try {
    const sale = await prisma.offlineSale.create({
      data: {
        saleNumber: generateSaleNumber(),
        customerName: input.customerName?.trim() || null,
        customerPhone: input.customerPhone?.trim() || null,
        subtotal,
        discount,
        total,
        paymentMethod: input.paymentMethod || "cash",
        paymentStatus: input.paymentStatus || "paid",
        notes: input.notes?.trim() || null,
        soldBy: input.soldBy?.trim() || null,
        saleDate: input.saleDate ? new Date(input.saleDate) : new Date(),
        items: {
          create: input.items.map((item) => ({
            productId: item.productId || null,
            productName: item.productName.trim(),
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    revalidatePath("/admin/offline-sales");
    return { success: true, sale };
  } catch (err) {
    console.error("Create offline sale error:", err);
    return { success: false, error: "Failed to create sale. Please try again." };
  }
}

export async function deleteOfflineSale(id: string) {
  const auth = await verifyAdminAuth();
  if (!auth.isValid) return { success: false, error: auth.error };

  try {
    await prisma.offlineSale.delete({ where: { id } });
    revalidatePath("/admin/offline-sales");
    return { success: true };
  } catch (err) {
    console.error("Delete offline sale error:", err);
    return { success: false, error: "Failed to delete sale" };
  }
}
