// src/features/TitleScreen/TitleScreen.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryScreen } from "../GalleryScreen/GalleryScreen"; // Import Gallery
import { useMetaStore } from "../../store"; // Import meta store

interface TitleScreenProps {
  onGameStart: () => void; // Callback function to signal game start
}

// 圖片 URL
const patternUrl =
  "https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366787/Untitled_design_5_kzlr14.webp";
const charUrl =
  "https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366523/7_l6nvt4.webp";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.4,
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 0.5 },
  },
};

const titleVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const buttonVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { delay: 1.0, duration: 0.3 } },
};

// 這裡改用 Framer Motion 做背景無限移動＋角色 slide in + 果凍效果
const TitleBackground: React.FC = () => (
  <>
    {/* 無限往右上角移動的背景 pattern */}
    <motion.div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${patternUrl})`,
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
      }}
      initial={{ backgroundPosition: "0px 0px" }}
      animate={{ backgroundPosition: ["0px 0px", "1000px -1000px"] }}
      transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
    />

    {/* 從底下 slide in，並帶果凍彈性效果的角色圖 */}
    <motion.img
      src={charUrl}
      className="absolute bottom-[10%] left-[15%]  w-[70%] opacity-70"
      initial={{ y: "100%", opacity: 0, scale: 1 }}
      animate={{ y: "0%", opacity: 0.8, scale: [1, 1.1, 0.9, 1] }}
      transition={{
        y: { type: "spring", stiffness: 70, damping: 10, delay: 1.5 },
        scale: { times: [0, 0.3, 0.6, 1], duration: 0.6, delay: 2 },
      }}
    />
  </>
);

export const TitleScreen: React.FC<TitleScreenProps> = ({ onGameStart }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // 檢查是否有解鎖過結局
  const hasUnlockedEndings = useMetaStore(
    (state) => state.unlockedEndings.length > 0
  );

  const handleStartClick = () => {
    setIsExiting(true);
  };

  const handleToggleGallery = () => {
    setIsGalleryOpen((prev) => !prev);
  };

  return (
    <>
      <AnimatePresence onExitComplete={onGameStart}>
        {!isExiting && (
          <motion.div
            className="relative w-full h-full flex flex-col items-center pt-[30%] text-center overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TitleBackground />

            {/* 遊戲標題 */}
            <motion.h1
              className="text-5xl sm:text-5xl md:text-6xl font-bold text-white mb-8 z-10 drop-shadow-lg rampart-one-regular"
              variants={titleVariants}
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
            >
              肉泥也想談戀愛
            </motion.h1>

            {/* 開始按鈕 */}
            <motion.button
              onClick={handleStartClick}
              className="px-8 py-3 z-10 transform text-white border border-white rounded-full w-[200px] mt-8 kaisei-tokumin-medium text-2xl"
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              開始遊戲
            </motion.button>

            {/* 回憶圖鑑按鈕（有解鎖結局才顯示） */}
            {hasUnlockedEndings && (
              <motion.button
                variants={buttonVariants}
                onClick={handleToggleGallery}
                className="mt-4 px-8 py-3 z-10 transform bg-pink-400 text-white border border-pink-400 rounded-full w-[200px] kaisei-tokumin-medium text-2xl"
              >
                回憶圖鑑
              </motion.button>
            )}

            {/* 版本號 */}
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

      {/* Gallery 畫面 */}
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
