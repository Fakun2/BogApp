"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { StepIndex } from "../_types/onboarding.types";

type AnimatedStepProps = {
  children: ReactNode;
  step: StepIndex;
};

export function AnimatedStep({ children, step }: AnimatedStepProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
