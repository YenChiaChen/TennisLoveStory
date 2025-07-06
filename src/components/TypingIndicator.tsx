// src/components/TypingIndicator.tsx
import React from 'react';
import { motion } from 'framer-motion';

const dotVariants = {
    initial: { y: "0%" },
    animate: { y: ["0%", "-50%", "0%"] }, // Bouncing effect
};

const containerVariants = {
    initial: { transition: { staggerChildren: 0.1 } },
    animate: { transition: { staggerChildren: 0.1 } }, // Stagger animation for each dot
};

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
        className="flex items-center justify-center space-x-1"
        variants={containerVariants}
        initial="initial"
        animate="animate"
    >
        {[...Array(3)].map((_, i) => (
            <motion.span
                key={i}
                className="w-1.5 h-1.5 bg-gray-300 rounded-full"
                variants={dotVariants}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                }}
            />
        ))}
    </motion.div>
  );
};