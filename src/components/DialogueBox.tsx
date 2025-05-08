// src/components/DialogueBox.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DialogueBoxProps {
  speakerName: string | null;
  dialogue: string;
  onDialogueAdvance: () => void;
  isVisible?: boolean;
  typingSpeed?: number; // 這次代表每個字元“理想”的間隔時間 (ms)
}

const boxVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
};

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speakerName,
  dialogue,
  onDialogueAdvance,
  isVisible = true,
  typingSpeed = 75, // 稍微加快一點速度 (35ms 約等於 28 字/秒)
}) => {
  const [charIndex, setCharIndex] = useState(0); // 仍然追蹤當前顯示到哪個索引
  const [isTyping, setIsTyping] = useState(false);

  // Refs for animation control
  const animationFrameRef = useRef<number | null>(null); // 儲存 rAF ID
  const lastUpdateTimeRef = useRef<number>(0);         // 上次更新時間戳
  const textToTypeRef = useRef<string>("");             // 要打字的完整文本
  const currentIndexRef = useRef<number>(0);           // 當前打字進度 (在 rAF 內部更新)

  // --- Effect to Setup and Start Animation ---
  useEffect(() => {
    if (isVisible && dialogue) {
      // --- Initialize ---
      textToTypeRef.current = dialogue; // 儲存完整文本
      currentIndexRef.current = 0;      // 重置內部索引
      setCharIndex(0);                  // 重置顯示索引 (觸發初始渲染)
      setIsTyping(true);
      lastUpdateTimeRef.current = performance.now(); // 記錄開始時間

      // --- Animation Loop Function ---
      const loop = (currentTime: number) => {
        const elapsedTime = currentTime - lastUpdateTimeRef.current;

        // 根據經過時間和速度，計算應該顯示多少個字元
        // Math.min確保不會超出總長度
        const newCharsToShow = Math.min(
          textToTypeRef.current.length,
          currentIndexRef.current + Math.floor(elapsedTime / typingSpeed)
        );

        // 只需要在索引實際增加時更新狀態
        if (newCharsToShow > currentIndexRef.current) {
             currentIndexRef.current = newCharsToShow;
             setCharIndex(newCharsToShow); // 更新 React 狀態以觸發渲染
             lastUpdateTimeRef.current = currentTime; // 更新時間戳 (或部分更新以平滑化)
        }

        // --- Check if finished ---
        if (currentIndexRef.current < textToTypeRef.current.length) {
          animationFrameRef.current = requestAnimationFrame(loop); // 繼續下一幀
        } else {
          setIsTyping(false); // 動畫結束
          animationFrameRef.current = null;
        }
      };

      // --- Start the loop ---
       // 取消之前的動畫幀請求（如果有的話）
      if (animationFrameRef.current) {
         cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(loop);

    } else {
      // --- Reset state if not visible or no dialogue ---
      setCharIndex(0);
      setIsTyping(false);
      // 取消動畫幀
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    // --- Cleanup Function ---
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [dialogue, isVisible, typingSpeed]); // Effect dependencies

  // --- Click Handler ---
  const handleClick = useCallback(() => {
    if (isTyping) {
      // --- Skip typing ---
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current); // Stop animation
        animationFrameRef.current = null;
      }
      setCharIndex(dialogue.length); // Show full text immediately
      setIsTyping(false);
    } else if (isVisible) {
      // --- Advance dialogue ---
      onDialogueAdvance();
    }
  }, [isTyping, isVisible, dialogue, onDialogueAdvance]); // Include dialogue length in dependency? No, ref is fine.

  if (!isVisible) return null;

  // Get displayed text using slice based on the state charIndex
  const displayedText = dialogue.slice(0, charIndex);

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-1/4 md:h-1/3 bg-black bg-opacity-70 text-white p-4 md:p-6 z-20 cursor-pointer border-t-2 border-pink-300 kaisei-tokumin-regular"
      onClick={handleClick}
      variants={boxVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      aria-live="polite"
      aria-busy={isTyping}
    >
      {speakerName && (
        <div className="absolute -top-8 left-6 bg-pink-600 px-4 py-1 rounded-t-md border border-b-0 border-pink-300">
          <p className="text-lg font-semibold">{speakerName}</p>
        </div>
      )}
      <p className="text-xl md:text-2xl whitespace-pre-wrap">
        {/* We only need displayedText here */}
        {displayedText}
        {/* Blinking cursor when typing */}
        {isTyping && <span className="inline-block w-1 h-6 bg-white ml-1 animate-pulse"></span>}
      </p>
    </motion.div>
  );
};