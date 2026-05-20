"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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

const PATHS = [
  "/admin/offline-sales",
  "/admin/offline-sales/tags",
  "/admin/offline-sales/new",
];

export async function getItemTags() {
  try {
    return await prisma.itemTag.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    return [];
  }
}

export async function createItemTag(name: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized." };
  try {
    if (!name.trim()) return { success: false, error: "Name is required." };
    const tag = await prisma.itemTag.create({ data: { name: name.trim() } });
    PATHS.forEach((p) => revalidatePath(p));
    return { success: true, tag };
  } catch {
    return { success: false, error: "Failed to create tag." };
  }
}

export async function updateItemTag(id: string, name: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized." };
  try {
    if (!name.trim()) return { success: false, error: "Name is required." };
    const tag = await prisma.itemTag.update({ where: { id }, data: { name: name.trim() } });
    PATHS.forEach((p) => revalidatePath(p));
    return { success: true, tag };
  } catch {
    return { success: false, error: "Failed to update tag." };
  }
}

export async function deleteItemTag(id: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized." };
  try {
    await prisma.itemTag.delete({ where: { id } });
    PATHS.forEach((p) => revalidatePath(p));
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete tag." };
  }
}
