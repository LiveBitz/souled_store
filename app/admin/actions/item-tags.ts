"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getItemTags() {
  try {
    return await prisma.itemTag.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    return [];
  }
}

export async function createItemTag(name: string) {
  try {
    if (!name.trim()) return { success: false, error: "Name is required." };
    await prisma.itemTag.create({ data: { name: name.trim() } });
    revalidatePath("/admin/offline-sales");
    revalidatePath("/admin/offline-sales/tags");
    revalidatePath("/admin/offline-sales/new");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create tag." };
  }
}

export async function updateItemTag(id: string, name: string) {
  try {
    if (!name.trim()) return { success: false, error: "Name is required." };
    await prisma.itemTag.update({ where: { id }, data: { name: name.trim() } });
    revalidatePath("/admin/offline-sales");
    revalidatePath("/admin/offline-sales/tags");
    revalidatePath("/admin/offline-sales/new");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update tag." };
  }
}

export async function deleteItemTag(id: string) {
  try {
    await prisma.itemTag.delete({ where: { id } });
    revalidatePath("/admin/offline-sales");
    revalidatePath("/admin/offline-sales/tags");
    revalidatePath("/admin/offline-sales/new");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete tag." };
  }
}
