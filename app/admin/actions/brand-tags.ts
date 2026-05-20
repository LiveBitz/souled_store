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
  "/admin/offline-sales/brand-tags",
  "/admin/offline-sales/new",
];

export async function getBrandTags() {
  try {
    return await prisma.brandTag.findMany({ orderBy: { createdAt: "asc" } });
  } catch {
    return [];
  }
}

export async function createBrandTag(name: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized." };
  try {
    if (!name.trim()) return { success: false, error: "Name is required." };
    const tag = await prisma.brandTag.create({ data: { name: name.trim() } });
    PATHS.forEach((p) => revalidatePath(p));
    return { success: true, tag };
  } catch {
    return { success: false, error: "Failed to create brand tag." };
  }
}

export async function updateBrandTag(id: string, name: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized." };
  try {
    if (!name.trim()) return { success: false, error: "Name is required." };
    const tag = await prisma.brandTag.update({ where: { id }, data: { name: name.trim() } });
    PATHS.forEach((p) => revalidatePath(p));
    return { success: true, tag };
  } catch {
    return { success: false, error: "Failed to update brand tag." };
  }
}

export async function deleteBrandTag(id: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized." };
  try {
    await prisma.brandTag.delete({ where: { id } });
    PATHS.forEach((p) => revalidatePath(p));
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete brand tag." };
  }
}
