import type { StoryNode, StoryData, GameState, ConditionChecker, GameStateModifier, Choice } from '../types';
import { useGameStore } from '../store/useGameStore';
import { useCharacterStore, type CharacterStoreState } from '../store/useCharacterStore';

// --- Placeholder Story Data (Replace with import from src/data/story/...) ---
const storyDataSource: StoryData = {
  'start': { id: 'start', sceneId: 'placeholder_scene', text: "遊戲開始...", nextNodeId: 'node_1' },
  'node_1': { id: 'node_1', sceneId: 'placeholder_scene', text: "這是第一個節點。", choices: [{ text: "選擇 A", nextStoryNodeId: 'end' }] },
  'end': { id: 'end', sceneId: 'placeholder_scene', text: "遊戲結束。" },
};
// --- End Placeholder Data ---


export class StoryEngine {
  private storyData: StoryData;

  constructor(storyData: StoryData = storyDataSource) {
    // In a real scenario, you might load this dynamically
    this.storyData = storyData;
    console.log("StoryEngine Initialized");
  }

  getNode(nodeId: string | null): StoryNode | null {
    if (!nodeId || !this.storyData[nodeId]) {
      console.warn(`Story node not found: ${nodeId}`);
      return null;
    }
    return this.storyData[nodeId];
  }

  // Processes entering a new node: applying effects, setting scene, checking audio
  processNodeEntry(node: StoryNode): void {
    const gameState = useGameStore.getState();
    const characterState = useCharacterStore.getState();

    // 1. Update Scene (if changed)
    if (node.sceneId && node.sceneId !== gameState.currentSceneId) {
        useGameStore.getState().setScene(node.sceneId);
        // TODO: Trigger background change in UI
    }

    // 2. Apply Node Effects
    if (node.effects) {
        this.applyEffects(node.effects, gameState, characterState);
    }

    // 3. Trigger Audio Changes (BGM, SFX)
    if (node.audio) {
        // TODO: Integrate with an audio engine/hook (e.g., useAudioPlayer)
        console.log('Audio trigger:', node.audio);
        // Example: if (node.audio.bgm) audioPlayer.playBgm(node.audio.bgm);
        // Example: if (node.audio.sfx) audioPlayer.playSfx(node.audio.sfx);
    }

    // 4. Trigger Minigame?
    if (node.triggerMiniGameId) {
      useGameStore.getState().setActiveMiniGame(node.triggerMiniGameId);
      // The UI will need to react to activeMiniGameId and render the game
    }
  }

  // Processes selecting a choice: applying effects, advancing story
  processChoice(choice: Choice): void {
      const gameState = useGameStore.getState();
      const characterState = useCharacterStore.getState();

      // 1. Apply Choice Effects
      if (choice.effects) {
          this.applyEffects(choice.effects, gameState, characterState);
      }

      // 2. Advance to the next node
      useGameStore.getState().setStoryNode(choice.nextStoryNodeId);
  }

   // Handles automatic progression if node has nextNodeId
   processAutoAdvance(node: StoryNode): void {
    if (node.nextNodeId) {
      useGameStore.getState().setStoryNode(node.nextNodeId);
    } else if (!node.choices && !node.triggerMiniGameId) {
      console.warn(`Node ${node.id} has no choices, nextNodeId, or minigame. Story stuck?`);
    }
  }


  // Helper to apply an array of effect functions
  private applyEffects(
      effects: GameStateModifier[],
      gameState: GameState,
      characterState: CharacterStoreState
  ): void {
      // Important: Get fresh state *before* applying effects if they depend on each other
      // However, for Zustand, calling set multiple times is usually fine.
      effects.forEach(effect => {
          try {
              // Pass the *current* state slices to the effect function
              effect(useGameStore.getState(), useCharacterStore.getState());
          } catch (error) {
              console.error(`Error applying effect: ${error}`, effect);
          }
      });
  }


  // Helper to check conditions for choices
  checkCondition(condition: ConditionChecker): boolean {
    const gameState = useGameStore.getState();
    const characterState = useCharacterStore.getState();
    try {
        return condition(gameState, characterState);
    } catch (error) {
        console.error(`Error checking condition: ${error}`, condition);
        return false; // Default to false if condition check fails
    }
  }
}

// You might instantiate a single engine instance or use it statically
// export const storyEngine = new StoryEngine(loadedStoryData);