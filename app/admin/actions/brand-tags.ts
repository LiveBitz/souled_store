"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBrandTags() {
  try {
    return await prisma.brandTag.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    return [];
  }
}

export async function createBrandTag(name: string) {
  try {
    if (!name.trim()) return { success: false, error: "Name is required." };
    await prisma.brandTag.create({ data: { name: name.trim() } });
    revalidatePath("/admin/offline-sales");
    revalidatePath("/admin/offline-sales/brand-tags");
    revalidatePath("/admin/offline-sales/new");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create brand tag." };
  }
}

export async function updateBrandTag(id: string, name: string) {
  try {
    if (!name.trim()) return { success: false, error: "Name is required." };
    await prisma.brandTag.update({ where: { id }, data: { name: name.trim() } });
    revalidatePath("/admin/offline-sales");
    revalidatePath("/admin/offline-sales/brand-tags");
    revalidatePath("/admin/offline-sales/new");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update brand tag." };
  }
}

export async function deleteBrandTag(id: string) {
  try {
    await prisma.brandTag.delete({ where: { id } });
    revalidatePath("/admin/offline-sales");
    revalidatePath("/admin/offline-sales/brand-tags");
    revalidatePath("/admin/offline-sales/new");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete brand tag." };
  }
}
