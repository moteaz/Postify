import { Variants } from "framer-motion";

// Easing constants
export const EASE_OUT_SMOOTH = [0.25, 0.46, 0.45, 0.94];
export const EASE_SPRING = { type: "spring" as const, stiffness: 300, damping: 28 };
export const EASE_BOUNCE = { type: "spring" as const, stiffness: 400, damping: 20 };
export const EASE_GENTLE = { type: "spring" as const, stiffness: 200, damping: 30 };

// Fade up — most used entrance
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_SMOOTH }
  }
};

// Fade in — subtle, no movement
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Fade up with scale — for cards
export const cardEntrance: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT_SMOOTH }
  }
};

// Slide in from left — for brand panel
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_OUT_SMOOTH }
  }
};

// Slide in from right — for auth card
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_OUT_SMOOTH }
  }
};

// Stagger container — wraps children that animate in sequence
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

// Stagger container (slower) — for sections with fewer items
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 }
  }
};

// Pop — for badges, pills, small accents
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: EASE_BOUNCE
  }
};

// Shake — for form validation errors
export const shake: Variants = {
  shake: {
    x: [-4, 4, -4, 4, -2, 2, 0],
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

// Tab content swap
export const tabContent: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};
