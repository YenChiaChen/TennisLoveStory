// src/features/EndingScreen/EndingScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, useCharacterStore, useMetaStore } from '../../store';
import { getEndingById } from '../../data/ending';
import type { Ending } from '../../types';

interface EndingScreenProps {
  returnToTitle: () => void; // Callback function passed from App.tsx
}

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.0 } },
  exit: { opacity: 0, transition: { duration: 0.5 } },
};

const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } },
};

const cgVariants = {
     hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.2, delay: 0.2 } },
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ returnToTitle }) => {
  const activeEndingId = useGameStore((state) => state.activeEndingId);
  const setActiveEnding = useGameStore((state) => state.setActiveEnding);
  const resetGameState = useGameStore((state) => state.resetGameState);
  const resetCharacterStates = useCharacterStore((state) => state.resetCharacterStates);
  const unlockEnding = useMetaStore((state) => state.unlockEnding); // Get unlock action

  const [endingData, setEndingData] = useState<Ending | null>(null);
  const [textIndex, setTextIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (activeEndingId) {
      const data = getEndingById(activeEndingId);
      setEndingData(data ?? null);
      setTextIndex(0); // Reset text index when ending changes
      setShowContinue(false);
    } else {
      setEndingData(null); // Clear data if no active ending
    }
  }, [activeEndingId]);

  const handleAdvanceText = useCallback(() => {
    if (!endingData) return;

    const textContent = endingData.text;
    if (Array.isArray(textContent)) {
      if (textIndex < textContent.length - 1) {
        setTextIndex(prev => prev + 1);
      } else {
         setShowContinue(true); // Show continue button after last text
      }
    } else {
      // If text is a single string, show continue immediately
      setShowContinue(true);
    }
  }, [endingData, textIndex]);

  const handleReturnToTitle = useCallback(() => {
      if (!activeEndingId) return;

      console.log("Returning to title, unlocking ending:", activeEndingId);
      // 1. Unlock the ending in meta store
      unlockEnding(activeEndingId);

      // 2. Reset game state
      resetGameState();
      resetCharacterStates();

       // 3. Clear active ending (hides this screen)
      setActiveEnding(null); // This might trigger unmount *before* returnToTitle callback finishes if not careful

      // 4. Call the callback provided by App.tsx
      returnToTitle();

  }, [activeEndingId, unlockEnding, resetGameState, resetCharacterStates, setActiveEnding, returnToTitle]);


  if (!activeEndingId || !endingData) {
    return null; // Don't render if no active ending
  }

  const currentText = Array.isArray(endingData.text)
                        ? endingData.text[textIndex]
                        : endingData.text;

  return (
    // Use AnimatePresence if EndingScreen is conditionally rendered in MainGame/App
    <motion.div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-8 text-center"
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
    >
      {/* Optional CG Image */}
      {endingData.cgPath && (
         <motion.img
            key={endingData.cgPath} // Key ensures animation on change
            src={endingData.cgPath}
            alt={`${endingData.name} CG`}
            className="absolute inset-0 w-full h-full object-cover opacity-50 z-0" // Background CG
             variants={cgVariants}
          />
      )}

       {/* Ending Title */}
       <motion.h2
           className="text-3xl md:text-4xl font-bold mb-8 z-10 drop-shadow-md"
            variants={textVariants} // Animate title
       >
           {endingData.name}
       </motion.h2>

      {/* Ending Text */}
      {/* Key ensures text animates in each time it changes */}
      <motion.p
        key={textIndex}
        className="text-xl md:text-2xl whitespace-pre-wrap mb-12 z-10 max-w-3xl drop-shadow-md leading-relaxed"
        variants={textVariants}
        onClick={handleAdvanceText} // Click text to advance
        style={{ cursor: showContinue ? 'default' : 'pointer' }}
      >
        {currentText}
      </motion.p>


      {/* Continue Button */}
       <AnimatePresence>
        {showContinue && (
            <motion.button
                onClick={handleReturnToTitle}
                className="mt-8 px-6 py-2 bg-white text-black font-semibold rounded shadow-lg hover:bg-gray-200 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
            >
                回到標題畫面
            </motion.button>
        )}
        </AnimatePresence>
    </motion.div>
  );
};