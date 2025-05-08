import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AffectionAnimationItem, GameState } from '../types';

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
  addAffectionAnimation: (characterId: string, amount: number) => void;
  removeAffectionAnimation: (id: number) => void;
  unlockPhone: () => void;      // New action
  openPhone: () => void;        // New action
  closePhone: () => void;       // New action
  advanceDay: (days?: number) => void; // New action to advance day counter
}

let nextAnimationId = 0;

const initialGameState: GameState = {
  currentStoryNodeId: 'start', // Default starting node ID
  currentSceneId: null, // Will likely be set by the first story node
  activeMiniGameId: null,
  gameFlags: {},
  miniGameReturnContext: null,
  isInSideQuest: false,
  returnStoryNodeId: null,
  activeEndingId: null,
  affectionAnimationQueue: [],
  isPhoneUnlocked: false, 
  isPhoneOpen: false,    
  currentDay: 1,         
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

      addAffectionAnimation: (characterId, amount) => {
        const newItem: AffectionAnimationItem = {
          id: nextAnimationId++, // Assign unique ID
          characterId,
          amount,
        };
        console.log('Queueing affection animation:', newItem);
        set((state) => ({
          // Add new item to the end of the queue
          affectionAnimationQueue: [...state.affectionAnimationQueue, newItem],
        }));

         // Optional: Automatically remove after a delay if not handled by component exit
         // setTimeout(() => {
         //     get().removeAffectionAnimation(newItem.id);
         // }, 3000); // Remove after 3 seconds timeout
      },

      removeAffectionAnimation: (idToRemove: number) => {
         // console.log('Removing affection animation:', idToRemove);
          set((state) => ({
              affectionAnimationQueue: state.affectionAnimationQueue.filter(
                  (item) => item.id !== idToRemove
              ),
          }));
      },

      unlockPhone: () => {
        console.log("Phone Unlocked!");
        set({ isPhoneUnlocked: true });
      },
      openPhone: () => {
          // Optional: Add checks if phone can be opened (e.g., not during minigame/ending)
          if (get().activeMiniGameId || get().activeEndingId || get().isPhoneOpen) return;
          console.log("Opening Phone");
          set({ isPhoneOpen: true });
      },
      closePhone: () => {
          console.log("Closing Phone");
          set({ isPhoneOpen: false });
      },
      // --- Day Action ---
      advanceDay: (days = 1) => {
          if (days <= 0) return;
          set((state) => {
              const nextDay = state.currentDay + days;
              console.log(`Advancing day to: ${nextDay}`);
              // You might trigger other checks here when day advances (e.g., new events available)
              return { currentDay: nextDay };
          });
           // Potentially check for side quests again at start of day?
          // checkAndTriggerSideQuests(...); // Needs careful implementation
      },

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
        isInSideQuest: state.isInSideQuest, // Persist quest status
        returnStoryNodeId: state.returnStoryNodeId, // Persist return node
        isPhoneUnlocked: state.isPhoneUnlocked, // Persist unlocked status
        currentDay: state.currentDay, // Persist current day
      }),
    }
  )
);

// Selector example (optional but good practice)
export const selectGameFlag = (flagName: string) => (state: GameState) => state.gameFlags[flagName];