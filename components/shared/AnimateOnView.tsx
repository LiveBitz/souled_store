"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimateOnViewProps {
  children: ReactNode;
  className?: string;
  /** Extra delay in seconds before the animation starts */
  delay?: number;
  /** up = fade + rise (default); none = fade only */
  direction?: "up" | "none";
}

/**
 * Lightweight scroll-triggered reveal.
 * Wraps any content (server- or client-rendered) with a
 * one-shot fade-up animation when it enters the viewport.
 * Uses only `opacity` and `transform` — both GPU-accelerated.
 */
export function AnimateOnView({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: AnimateOnViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: direction === "up" ? 22 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      viewport={{ once: true, margin: "-56px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
