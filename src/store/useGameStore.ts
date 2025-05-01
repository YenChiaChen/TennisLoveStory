import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState } from '../types';

interface GameStateActions {
  setStoryNode: (nodeId: string | null) => void;
  setScene: (sceneId: string | null) => void;
  setGameFlag: (flagName: string, value: boolean | number | string) => void;
  clearGameFlag: (flagName: string) => void;
  setActiveMiniGame: (miniGameId: string | null) => void;
  resetGameState: () => void; // For starting new game
  loadGameState: (state: GameState) => void; // For loading saved game
}

const initialGameState: GameState = {
  currentStoryNodeId: 'start', // Default starting node ID
  currentSceneId: null, // Will likely be set by the first story node
  activeMiniGameId: null,
  gameFlags: {},
};

export const useGameStore = create<GameState & GameStateActions>()(
  persist(
    (set, get) => ({
      ...initialGameState,

      setStoryNode: (nodeId) => set({ currentStoryNodeId: nodeId }),
      setScene: (sceneId) => set({ currentSceneId: sceneId }),
      setGameFlag: (flagName, value) => set((state) => ({
        gameFlags: { ...state.gameFlags, [flagName]: value },
      })),
      clearGameFlag: (flagName) => set((state) => {
        const newFlags = { ...state.gameFlags };
        delete newFlags[flagName];
        return { gameFlags: newFlags };
      }),
      setActiveMiniGame: (miniGameId) => set({ activeMiniGameId: miniGameId }),
      resetGameState: () => set(initialGameState),
      loadGameState: (state) => set(state),
    }),
    {
      name: 'rohnin-game-state-storage', // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Define localStorage persistence
      partialize: (state) => ({ // Choose which parts of the state to persist
        currentStoryNodeId: state.currentStoryNodeId,
        currentSceneId: state.currentSceneId,
        gameFlags: state.gameFlags,
        // Don't persist activeMiniGameId, as it's runtime state
      }),
    }
  )
);

// Selector example (optional but good practice)
export const selectGameFlag = (flagName: string) => (state: GameState) => state.gameFlags[flagName];