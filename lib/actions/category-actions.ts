"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function updateCategoryImage(id: string, imageUrl: string) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { image: imageUrl },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    
    return { success: true, category };
  } catch (error) {
    console.error("Failed to update category image:", error);
    return { success: false, error: "Failed to update visual asset" };
  }
}
