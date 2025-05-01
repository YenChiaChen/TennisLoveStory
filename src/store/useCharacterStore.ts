import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CharacterRuntimeState } from '../types';
// IMPORTANT: You'll need to create and import your actual character definitions
// import { CHARACTERS_DATA } from '../data/characters'; // Assuming data/characters.ts exports this

// --- Placeholder Data (Replace with import from src/data/characters.ts) ---
const CHARACTERS_DATA: Record<string, { initialAffection: number }> = {
  'senpai_A': { initialAffection: 10 },
  'rival_B': { initialAffection: 5 },
};
// --- End Placeholder Data ---

export interface CharacterStoreState {
  characters: Record<string, CharacterRuntimeState>; // Keyed by character ID
}

interface CharacterActions {
  setAffection: (characterId: string, value: number) => void;
  increaseAffection: (characterId: string, amount: number) => void;
  decreaseAffection: (characterId: string, amount: number) => void;
  setHasMet: (characterId: string, hasMet: boolean) => void;
  resetCharacterStates: () => void;
  loadCharacterStates: (states: Record<string, CharacterRuntimeState>) => void;
}

// Function to generate initial state from character data
const getInitialCharacterStates = (): Record<string, CharacterRuntimeState> => {
  return Object.keys(CHARACTERS_DATA).reduce((acc, charId) => {
    acc[charId] = {
      affection: CHARACTERS_DATA[charId].initialAffection,
      hasMet: false, // Default to not met initially
    };
    return acc;
  }, {} as Record<string, CharacterRuntimeState>);
};


export const useCharacterStore = create<CharacterStoreState & CharacterActions>()(
  persist(
    (set, get) => ({
      characters: getInitialCharacterStates(),

      setAffection: (characterId, value) => set((state) => {
          if (!state.characters[characterId]) return {}; // Avoid errors if character doesn't exist
          const clampedValue = Math.max(0, Math.min(100, value)); // Clamp between 0-100
          return {
            characters: {
              ...state.characters,
              [characterId]: { ...state.characters[characterId], affection: clampedValue },
            },
          };
        }),

      increaseAffection: (characterId, amount) => {
        const currentAffection = get().characters[characterId]?.affection ?? 0;
        get().setAffection(characterId, currentAffection + amount);
      },

      decreaseAffection: (characterId, amount) => {
         get().increaseAffection(characterId, -amount); // Reuse increase with negative amount
      },

      setHasMet: (characterId, hasMet) => set((state) => {
          if (!state.characters[characterId]) return {};
          return {
            characters: {
              ...state.characters,
              [characterId]: { ...state.characters[characterId], hasMet },
            },
          };
        }),

      resetCharacterStates: () => set({ characters: getInitialCharacterStates() }),
      loadCharacterStates: (states) => set({ characters: states }),

    }),
    {
      name: 'rohnin-character-state-storage',
      storage: createJSONStorage(() => localStorage),
      // Persist the entire 'characters' object
    }
  )
);

// Selector examples
export const selectCharacterAffection = (characterId: string) => (state: CharacterStoreState) => state.characters[characterId]?.affection;
export const selectHasMetCharacter = (characterId: string) => (state: CharacterStoreState) => state.characters[characterId]?.hasMet ?? false;