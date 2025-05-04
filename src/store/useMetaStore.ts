// src/store/useMetaStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MetaState {
  unlockedEndings: string[]; // Array of unlocked ending IDs
  // Add other meta unlocks here later (e.g., unlockedCGs, music tracks)
}

interface MetaActions {
  unlockEnding: (endingId: string) => void;
  resetMetaUnlocks: () => void; // Optional: For full game reset
}

const initialMetaState: MetaState = {
  unlockedEndings: [],
};

export const useMetaStore = create<MetaState & MetaActions>()(
  persist(
    (set, get) => ({
      ...initialMetaState,

      unlockEnding: (endingId) => {
        if (!get().unlockedEndings.includes(endingId)) {
            console.log(`MetaUnlock: Ending ${endingId}`);
            set((state) => ({
                unlockedEndings: [...state.unlockedEndings, endingId],
            }));
        } else {
             console.log(`MetaUnlock: Ending ${endingId} already unlocked.`);
        }
      },

      resetMetaUnlocks: () => set(initialMetaState),

    }),
    {
      name: 'rohnin-meta-storage', // Use a DIFFERENT name for meta persistence!
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// src/store/index.ts
// ... existing exports
export * from './useMetaStore';