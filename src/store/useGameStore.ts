import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState } from '../types';

type MiniGameReturnContext = 'story' | 'map' | null;

interface GameStateActions {
  setStoryNode: (nodeId: string | null) => void;
  setScene: (sceneId: string | null) => void;
  setGameFlag: (flagName: string, value: boolean | number | string) => void;
  clearGameFlag: (flagName: string) => void;
  setActiveMiniGame: (miniGameId: string | null, context?: MiniGameReturnContext)  => void;
  resetGameState: () => void; // For starting new game
  loadGameState: (state: GameState) => void; // For loading saved game
  startSideQuest: (sideQuestNodeId: string, returnNodeId: string) => void;
  endSideQuest: () => void; // New action
  setActiveEnding: (endingId: string | null) => void;
}

const initialGameState: GameState = {
  currentStoryNodeId: 'start', // Default starting node ID
  currentSceneId: null, // Will likely be set by the first story node
  activeMiniGameId: null,
  gameFlags: {},
  miniGameReturnContext: null,
  isInSideQuest: false,
  returnStoryNodeId: null,
  activeEndingId: null,
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
      
      setActiveMiniGame: (miniGameId, context = null) => { 
        set({ activeMiniGameId: miniGameId, miniGameReturnContext: context });
        console.log(`Minigame ${miniGameId} activated with context: ${context}`);
      },
      startSideQuest: (sideQuestNodeId, returnNodeId) => {
        console.log(`Starting side quest at ${sideQuestNodeId}, will return to ${returnNodeId}`);
        set({
          isInSideQuest: true,
          returnStoryNodeId: returnNodeId,
          currentStoryNodeId: sideQuestNodeId, // Immediately jump to side quest
        });
      },

      endSideQuest: () => {
        const returnNode = get().returnStoryNodeId;
        console.log(`Ending side quest, returning to ${returnNode}`);
        if (!returnNode) {
          console.error("Cannot end side quest: returnStoryNodeId is null!");
          // Fallback to a safe node?
          set({ isInSideQuest: false, returnStoryNodeId: null, currentStoryNodeId: 'start' });
          return;
        }
        set({
          isInSideQuest: false,
          returnStoryNodeId: null,
          currentStoryNodeId: returnNode, // Jump back to main story
        });
      },

      setActiveEnding: (endingId) => set({ activeEndingId: endingId }),

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