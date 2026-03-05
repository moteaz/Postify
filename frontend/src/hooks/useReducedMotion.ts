"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

export function useReducedMotion() {
  return useFramerReducedMotion();
}

export function useSafeAnimation() {
  const reduce = useFramerReducedMotion();
  return reduce ? { duration: 0.01 } : undefined;
}
