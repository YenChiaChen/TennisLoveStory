import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CharacterRuntimeState } from "../types";
import { CHARACTERS_DATA } from "../data/characters";
import { useGameStore } from "./useGameStore";
// IMPORTANT: You'll need to create and import your actual character definitions
// import { CHARACTERS_DATA } from '../data/characters'; // Assuming data/characters.ts exports this

// --- Placeholder Data (Replace with import from src/data/characters.ts) ---

// --- End Placeholder Data ---

export interface CharacterStoreState {
  characters: Record<string, CharacterRuntimeState>; // Keyed by character ID
  increaseAffection: (characterId: string, amount: number) => void;
  decreaseAffection: (characterId: string, amount: number) => void;
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

export const useCharacterStore = create<
  CharacterStoreState & CharacterActions
>()(
  persist(
    (set, get) => ({
      characters: getInitialCharacterStates(),

      setAffection: (characterId, value) =>
        set((state) => {
          const character = state.characters[characterId];
          if (!character) return {};
          const clampedValue = Math.max(0, Math.min(100, value)); // Clamp
          // *** Calculate change BEFORE setting state ***
          const changeAmount = clampedValue - character.affection;

          // *** Trigger animation if affection actually changed ***
          if (changeAmount !== 0) {
            useGameStore
              .getState()
              .addAffectionAnimation(characterId, changeAmount);
          }

          return {
            characters: {
              ...state.characters,
              [characterId]: { ...character, affection: clampedValue },
            },
          };
        }),

      increaseAffection: (characterId, amount) => {
        if (amount <= 0) return; // Ensure positive amount
        const currentAffection = get().characters[characterId]?.affection ?? 0;
        // Call setAffection which now handles clamping AND triggering the animation
        get().setAffection(characterId, currentAffection + amount);
      },

      decreaseAffection: (characterId, amount) => {
        if (amount <= 0) return; // Ensure positive amount
        const currentAffection = get().characters[characterId]?.affection ?? 0;
        // Call setAffection which now handles clamping AND triggering the animation
        get().setAffection(characterId, currentAffection - amount);
      },

      setHasMet: (characterId, hasMet) =>
        set((state) => {
          console.log(`ACTION: setHasMet called for ${characterId}`);
          if (!state.characters[characterId]) {
            console.warn(
              `ACTION: Character ${characterId} not found in state.`
            );
            return {};
          }
          console.log(`ACTION: Setting hasMet=${hasMet} for ${characterId}`); // 添加日誌
          return {
            characters: {
              ...state.characters,
              [characterId]: { ...state.characters[characterId], hasMet },
            },
          };
        }),

      resetCharacterStates: () =>
        set({ characters: getInitialCharacterStates() }),
      loadCharacterStates: (states) => set({ characters: states }),
    }),
    {
      name: "rohnin-character-state-storage",
      storage: createJSONStorage(() => localStorage),
      // Persist the entire 'characters' object
    }
  )
);

// Selector examples
export const selectCharacterAffection =
  (characterId: string) => (state: CharacterStoreState) =>
    state.characters[characterId]?.affection;
export const selectHasMetCharacter =
  (characterId: string) => (state: CharacterStoreState) =>
    state.characters[characterId]?.hasMet ?? false;
