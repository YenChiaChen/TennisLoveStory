// src/features/GalleryScreen/GalleryScreen.tsx
import React from 'react';
import { motion } from 'framer-motion'; // Import motion for potential animations
import { useMetaStore } from '../../store';
import { ENDINGS_DATA, getEndingById } from '../../data/ending';
import { getCharacterById } from '../../data/characters';
import type { Ending } from '../../types'; // Import Ending type

interface GalleryScreenProps {
  onClose: () => void;
}

// Interface to combine Ending and Character data for easier rendering
interface UnlockedCgInfo {
    ending: Ending;
    characterName: string;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ onClose }) => {
  const unlockedEndings = useMetaStore((state) => state.unlockedEndings);

  // Filter for unlocked endings that are good endings AND have a CG path
  const unlockedCgData: UnlockedCgInfo[] = unlockedEndings
    .map(id => getEndingById(id)) // Get ending data
    .filter((ending): ending is Ending => // Type guard to ensure ending is not undefined
        !!ending && ending.isGoodEnding && !!ending.cgPath && !!ending.characterId
    )
    .map(ending => {
        const character = getCharacterById(ending.characterId!); // Get character data (! because we filtered for characterId)
        return {
            ending: ending,
            characterName: character?.name ?? '未知角色' // Get character name
        };
    })
    // Optional: Sort by character name or ending name
    .sort((a, b) => a.characterName.localeCompare(b.characterName));


  return (
    <motion.div
      className="absolute inset-0 bg-black bg-opacity-90 z-40 flex items-center justify-center p-4 backdrop-blur-sm" // Added backdrop blur
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900 text-white rounded-lg shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative border border-purple-400 border-opacity-30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-light"
          aria-label="Close Gallery"
        >
          &times;
        </button>

        <h2 className="text-3xl font-semibold mb-8 text-center text-purple-300 tracking-wider">回憶畫廊</h2>

        {unlockedCgData.length === 0 ? (
          <p className="text-center text-gray-400 py-12">尚未解鎖任何特別的回憶...</p>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.05 } } // Stagger animation for grid items
            }}
          >
            {unlockedCgData.map(({ ending, characterName }) => (
              <motion.div
                key={ending.id}
                className="group relative aspect-square rounded-md overflow-hidden shadow-lg cursor-pointer border-2 border-transparent hover:border-purple-400 transition-colors duration-200"
                title={`${characterName} - ${ending.name}`}
                variants={{ // Simple fade-in for each item
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                }}
                // Add onClick later to show full image? e.g., onClick={() => setSelectedCg(ending.cgPath)}
              >
                {/* CG Image */}
                <img
                  src={ending.cgPath!} // We filtered for cgPath existence
                  alt={`${characterName} - ${ending.name}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay with Character Name */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-sm font-semibold text-center truncate">
                    {characterName}
                  </p>
                   <p className="text-purple-200 text-xs text-center truncate">
                    {ending.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

         {/* Optional: Separator and list of all achieved endings */}
         <div className='mt-10 pt-6 border-t border-gray-600 border-opacity-50'>
             <h3 className="text-xl font-semibold mb-4 text-purple-300">已達成結局列表</h3>
             {unlockedEndings.length === 0 ? (
                 <p className="text-center text-gray-400 py-4">尚未達成任何結局。</p>
             ) : (
                 <ul className='list-disc list-inside pl-4 columns-1 md:columns-2'>
                     {unlockedEndings.map(endingId => {
                         const ending = getEndingById(endingId);
                         return (
                             <li key={endingId} className='text-gray-300 mb-1 text-sm'>
                                 {ending?.name ?? endingId}
                             </li>
                         )
                     })}
                 </ul>
             )}
         </div>

      </div>
      {/* Add Modal logic here later if needed for full image view */}
      {/* {selectedCg && <CgViewerModal cgPath={selectedCg} onClose={() => setSelectedCg(null)} />} */}
    </motion.div>
  );
};

// Optional: Placeholder for a CG Viewer Modal Component
// const CgViewerModal = ({ cgPath, onClose }) => { /* ... implementation ... */ };