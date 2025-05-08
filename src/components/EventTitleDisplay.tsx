// src/components/EventTitleDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface EventTitleDisplayProps {
  titleText: string;
  onClick: () => void; // Callback to advance the story
}

// 動畫變體
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const titleVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 12, delay: 0.2 } },
  exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }
};

export const EventTitleDisplay: React.FC<EventTitleDisplayProps> = ({ titleText, onClick }) => {
  return (
    // 背景遮罩 + 點擊區域
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm cursor-pointer p-4 "
      onClick={onClick}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      aria-label={`事件：${titleText}，點擊繼續`} // Accessibility
    >
      {/* 文字容器 */}
      <motion.div
        className="bg-pink-300  bg-opacity-80 text-white p-6 md:p-8 rounded-lg shadow-xl max-w-lg text-center border border-[10px] border-white border-opacity-90  kaisei-tokumin-regular"
        variants={titleVariants}
        // Prevent click on text causing double event (if needed)
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl md:text-3xl font-semibold whitespace-pre-wrap leading-snug" // whitespace-pre-wrap respects \n
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
        >
            {titleText}
        </h2>
      </motion.div>
    </motion.div>
  );
};