// src/features/SettingsScreen/SettingsScreen.tsx
import React from 'react';
import { useCharacterStore } from '../../store';
import { CHARACTERS_DATA, getCharacterById } from '../../data/characters'; // Import character definitions


interface SettingsScreenProps {
  onClose: () => void; // Callback to close the settings screen
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const characterStates = useCharacterStore((state) => state.characters);

  // Filter character IDs that the player has met
  const metCharacterIds = Object.keys(characterStates).filter(
    (id) => characterStates[id]?.hasMet && id !== 'player' // Exclude player and unmet chars
  );

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
          aria-label="Close Settings"
        >
          &times; {/* HTML entity for 'X' */}
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">角色狀態</h2>

        {metCharacterIds.length === 0 ? (
          <p className="text-center text-gray-500">目前還沒有認識任何人...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metCharacterIds.map((charId) => {
              const characterData = getCharacterById(charId);
              const characterState = characterStates[charId];

              if (!characterData) return null; // Should not happen if ID exists in store

              return (
                <div key={charId} className="flex items-start p-4 border rounded-lg shadow-sm bg-gray-50">
                  {/* Character Sprite (Optional) */}
                  <div className="flex-shrink-0 w-24 h-24 mr-4 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                      {characterData.sprites.default ? (
                          <img
                              src={characterData.sprites.default}
                              alt={characterData.name}
                              className="object-contain w-full h-full"
                              style={{ imageRendering: 'pixelated' }}
                           />
                      ) : (
                          <span className='text-gray-400 text-sm'>(無圖像)</span>
                      )
                      }

                  </div>
                  {/* Character Info */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-indigo-700">{characterData.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 mb-2">{characterData.description || '（沒有描述）'}</p>
                    <div className="text-sm font-medium text-pink-600">
                      好感度： {characterState?.affection ?? 'N/A'} / 100
                      {/* You could add a simple bar visual here later */}
                    </div>
                     {/* Add more status info if needed */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};