
"use client";

import { motion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
};

export function Reveal({ children }: RevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 60,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
    >

      {children}

    </motion.div>
  );
}
