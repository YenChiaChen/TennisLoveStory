// src/components/AffectionChangeIndicator.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AffectionAnimationItem } from '../types';
import { useGameStore } from '../store'; // Import store hook to remove item
import { getCharacterById } from '../data/characters'; // To potentially get character info

interface AffectionChangeIndicatorProps {
  item: AffectionAnimationItem;
  onComplete: (id: number) => void; // Callback when animation finishes to remove from queue
}

const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 15, duration: 0.4 }
  },
  exit: {
      opacity: 0,
      y: -30, // Move up on exit
      scale: 0.7,
      transition: { duration: 0.3, ease: 'easeIn' }
  }
};

const AffectionChangeIndicator: React.FC<AffectionChangeIndicatorProps> = ({ item, onComplete }) => {
  const isIncrease = item.amount > 0;
  const character = getCharacterById(item.characterId); // Get character data (optional)

  useEffect(() => {
      // Automatically trigger removal after a delay (e.g., 1.5 seconds)
      const timer = setTimeout(() => {
          onComplete(item.id);
      }, 1500); // Adjust duration as needed

      return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [item.id, onComplete]);


  return (
    // Use AnimatePresence in the parent (MainGame) to handle enter/exit
    // The motion.div represents one single indicator instance
    <motion.div
      key={item.id} // Use the unique ID as key for AnimatePresence
      className={`
            flex items-center space-x-2 p-2 px-3 rounded-full shadow-lg fixed
            ${isIncrease ? 'bg-pink-500 border-pink-300' : 'bg-gray-600 border-gray-400'}
            border-2 text-white font-semibold text-sm z-50
            left-1/2 -translate-x-1/2 top-1/4 md:top-1/3 pointer-events-none
        `} // Position example: centered horizontally, partway down screen
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      // onAnimationComplete might be another way to trigger removal if needed,
      // but useEffect with timeout is simpler here.
      // onAnimationComplete={() => onComplete(item.id)} // Alternative removal trigger
       style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
    >
      {/* Optional Character Icon/Name */}
      {character?.sprites.default && (
          <img src={character.sprites.default} alt={character.name} className="w-6 h-6 rounded-full border border-white bg-gray-200 object-contain"/>
      )}
      {/* {!character?.sprites.default && <span className='text-lg'>{isIncrease ? '❤️' : '🖤'}</span>} */}


      {/* Heart Icon */}
      <span className='text-lg'>{isIncrease ? '💖' : '🤍'}</span>
      {/* Amount */}
      <span>{isIncrease ? `+${item.amount}` : `${item.amount}`}</span>

    </motion.div>
  );
};

// We need a wrapper component to handle the queue and AnimatePresence
interface AffectionIndicatorManagerProps {}

export const AffectionIndicatorManager: React.FC<AffectionIndicatorManagerProps> = () => {
    const queue = useGameStore((state) => state.affectionAnimationQueue);
    const removeAnimation = useGameStore((state) => state.removeAffectionAnimation);

    return (
         // AnimatePresence manages the enter/exit animations of children based on their keys
        <AnimatePresence>
             {queue.map((item) => (
                 <AffectionChangeIndicator
                     key={item.id} // Crucial for AnimatePresence
                     item={item}
                     onComplete={removeAnimation} // Pass the remove function
                 />
            ))}
        </AnimatePresence>
    );
};