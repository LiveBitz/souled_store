"use client";

import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/admin/actions/product";
import { useToast } from "@/hooks/use-toast";

interface DeleteProductButtonProps {
  id: string;
  name: string;
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        toast({
          title: "Product deleted",
          description: `"${name}" has been removed successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete product.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      disabled={isDeleting}
      onClick={handleDelete}
      className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
