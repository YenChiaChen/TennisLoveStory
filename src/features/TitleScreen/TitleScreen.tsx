// src/features/TitleScreen/TitleScreen.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryScreen } from "../GalleryScreen/GalleryScreen"; // Import Gallery
import { useMetaStore } from "../../store"; // Import meta store

interface TitleScreenProps {
  onGameStart: () => void; // Callback function to signal game start
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      when: "beforeChildren", // Animate children after container is ready
      staggerChildren: 0.4, // Stagger child animations
    },
  },
  exit: {
    opacity: 0,
    y: -50, // Move up slightly on exit
    transition: { duration: 0.5 },
  },
};

const titleVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const buttonVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { delay: 1.0, duration: 0.3 } }, // Appear after title
};

// Basic background component (can be enhanced)
const TitleBackground: React.FC = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 z-0">
    {/* You could add subtle moving elements here */}
  </div>
);

export const TitleScreen: React.FC<TitleScreenProps> = ({ onGameStart }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStartClick = () => {
    setIsExiting(true); // Start the exit animation
  };

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  // Check if any endings are unlocked to potentially show the gallery button
  const hasUnlockedEndings = useMetaStore(
    (state) => state.unlockedEndings.length > 0
  );

  const handleToggleGallery = () => {
    setIsGalleryOpen((prev) => !prev);
  };

  return (
    <>
      <AnimatePresence onExitComplete={onGameStart}>
        {!isExiting && ( // Only render if not exiting
          <motion.div
            className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit" // Specify exit variant
          >
            <TitleBackground />

            {/* Game Title */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 z-10 drop-shadow-lg"
              variants={titleVariants}
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
            >
              肉泥也想談戀愛
            </motion.h1>

            {/* Start Button */}
            <motion.button
              onClick={handleStartClick}
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 z-10 transform hover:scale-105 transition-transform duration-150"
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              開始遊戲
            </motion.button>

            {hasUnlockedEndings && (
              <button
                onClick={handleToggleGallery}
                className="mt-4 px-8 py-3 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-opacity-75 transform hover:scale-105 transition-transform duration-150 w-48"
              >
                回憶圖鑑
              </button>
            )}

            {/* Optional: Add version number or credits */}
            <motion.p
              className="absolute bottom-4 text-white text-opacity-70 text-sm z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.5 } }}
            >
              v1.0.0
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            key="gallery-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GalleryScreen onClose={handleToggleGallery} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
