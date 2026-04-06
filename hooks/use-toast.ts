"use client";

import { useState } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    console.log(`Toast: ${title} - ${description} (${variant})`);
    // For now, we'll just alert or console log as a fallback if the UI component isn't ready
    // But I will provide a proper implementation if needed.
    // Actually, I'll just use a simple state-based alert for now.
    if (typeof window !== "undefined") {
      alert(`${title}: ${description}`);
    }
  };

  return { toast, toasts };
}
