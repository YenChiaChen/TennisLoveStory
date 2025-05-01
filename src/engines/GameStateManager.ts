import { useGameStore } from '../store/useGameStore';
import { useCharacterStore } from '../store/useCharacterStore';
import { useSettingsStore } from '../store/useSettingsStore'; // Settings are usually persisted too

// This manager coordinates saving/loading across multiple stores if needed,
// although Zustand's persist middleware handles basic localStorage.
// It's useful for more complex scenarios like multiple save slots.

interface SaveSlot {
  id: number;
  timestamp: number;
  screenshot?: string; // Optional base64 encoded screenshot
  nodeId: string | null; // Quick reference for display
}

const SAVE_SLOTS_KEY = 'rohnin-save-slots';
const MAX_SAVE_SLOTS = 10; // Example limit

export class GameStateManager {
  constructor() {
    console.log("GameStateManager Initialized");
  }

  // --- Basic Save/Load using Zustand's built-in persistence ---
  // These might not be strictly needed if you only rely on the automatic persistence

  forceSaveCurrentState(): void {
    // Zustand's persist middleware usually saves automatically on state change.
    // This function is more for explicitly triggering a save if needed,
    // or for saving to a specific slot (see below).
    console.log("Forcing save (usually automatic via persist middleware)");
    // No direct action needed for basic persist, but could trigger slot save here.
  }

  // --- Slot-based Saving/Loading (More Advanced) ---

  getSaveSlotKey(slotId: number): string {
    return `rohnin-save-slot-${slotId}`;
  }

  async saveToSlot(slotId: number, screenshot?: string): Promise<boolean> {
    if (slotId < 0 || slotId >= MAX_SAVE_SLOTS) {
      console.error(`Invalid save slot ID: ${slotId}`);
      return false;
    }

    try {
      const gameState = useGameStore.getState();
      const characterState = useCharacterStore.getState();
      // Settings are often global, but you might choose to save them per-slot too
      // const settingsState = useSettingsStore.getState();

      const saveData = {
        game: {
          currentStoryNodeId: gameState.currentStoryNodeId,
          currentSceneId: gameState.currentSceneId,
          gameFlags: gameState.gameFlags,
        },
        characters: characterState.characters,
        // settings: settingsState, // Optional
      };

      const slotKey = this.getSaveSlotKey(slotId);
      localStorage.setItem(slotKey, JSON.stringify(saveData));

      // Update the list of save slots metadata
      const slots = await this.listSaveSlots();
      const existingSlotIndex = slots.findIndex(s => s.id === slotId);
      const slotMetadata: SaveSlot = {
        id: slotId,
        timestamp: Date.now(),
        screenshot: screenshot,
        nodeId: gameState.currentStoryNodeId,
      };

      if (existingSlotIndex !== -1) {
        slots[existingSlotIndex] = slotMetadata;
      } else {
        slots.push(slotMetadata);
        // Optional: Keep slots sorted or trim if exceeding max count
        slots.sort((a, b) => a.id - b.id); // Sort by ID
        if (slots.length > MAX_SAVE_SLOTS) {
             console.warn(`Exceeded max save slots (${MAX_SAVE_SLOTS}). Oldest slot might be removed if not managed.`);
             // Implement logic to remove oldest or prompt user if necessary
        }
      }
      localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));

      console.log(`Game saved to slot ${slotId}`);
      return true;
    } catch (error) {
      console.error(`Error saving to slot ${slotId}:`, error);
      return false;
    }
  }

  async loadFromSlot(slotId: number): Promise<boolean> {
     if (slotId < 0 || slotId >= MAX_SAVE_SLOTS) {
      console.error(`Invalid save slot ID: ${slotId}`);
      return false;
    }
    try {
      const slotKey = this.getSaveSlotKey(slotId);
      const savedDataString = localStorage.getItem(slotKey);

      if (!savedDataString) {
        console.error(`No data found for slot ${slotId}`);
        return false;
      }

      const savedData = JSON.parse(savedDataString);

      // Validate saved data structure (basic check)
      if (!savedData.game || !savedData.characters) {
          console.error(`Invalid save data format in slot ${slotId}`);
          return false;
      }

      // Reset state slightly before loading to avoid merging issues if structure changed
      // This depends on how you want loading to behave (full replace vs merge)
      // useGameStore.getState().resetGameState(); // Use with caution
      // useCharacterStore.getState().resetCharacterStates(); // Use with caution

      // Load state into stores
      useGameStore.getState().loadGameState(savedData.game);
      useCharacterStore.getState().loadCharacterStates(savedData.characters);
      // if (savedData.settings) {
      //   useSettingsStore.setState(savedData.settings); // Directly set state if needed
      // }

      console.log(`Game loaded from slot ${slotId}`);
      // Crucially, after loading, you likely need to re-process the current node
      const loadedNodeId = savedData.game.currentStoryNodeId;
      // It's often better to let the main game loop handle re-processing based on the new store state.
      // Example: Trigger a re-render or effect in your main game component.
      // storyEngine.processNodeEntry(storyEngine.getNode(loadedNodeId)); // Be careful with direct calls here

      return true;
    } catch (error) {
      console.error(`Error loading from slot ${slotId}:`, error);
      return false;
    }
  }

  async listSaveSlots(): Promise<SaveSlot[]> {
    try {
      const slotsJson = localStorage.getItem(SAVE_SLOTS_KEY);
      return slotsJson ? JSON.parse(slotsJson) : [];
    } catch (error) {
      console.error("Error listing save slots:", error);
      return [];
    }
  }

   async deleteSlot(slotId: number): Promise<boolean> {
     if (slotId < 0 || slotId >= MAX_SAVE_SLOTS) {
      console.error(`Invalid save slot ID: ${slotId}`);
      return false;
    }
     try {
       const slotKey = this.getSaveSlotKey(slotId);
       localStorage.removeItem(slotKey);

       // Update metadata
       let slots = await this.listSaveSlots();
       slots = slots.filter(s => s.id !== slotId);
       localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));

       console.log(`Save slot ${slotId} deleted.`);
       return true;
     } catch (error) {
       console.error(`Error deleting slot ${slotId}:`, error);
       return false;
     }
   }

  startNewGame(): void {
    // Reset relevant stores to their initial states
    useGameStore.getState().resetGameState();
    useCharacterStore.getState().resetCharacterStates();
    // Settings usually persist across new games, but you could reset if desired
    // useSettingsStore.getState().resetSettings();

    console.log("New game started. State reset.");
    // Similar to load, the UI should react to the reset state,
    // likely starting from the initial 'start' node.
  }
}

// export const gameStateManager = new GameStateManager();