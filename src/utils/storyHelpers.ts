import type { GameStateModifier, ConditionChecker } from '../types';
import { useCharacterStore } from '../store/useCharacterStore';
import { useGameStore } from '../store/useGameStore';
import { MAIN_STORY } from '../data/story/main_story';
import { CHARACTERS_DATA } from '../data/characters'; 
import { ENDINGS_DATA } from '../data/ending';

const MIN_AFFECTION_FOR_GOOD_END = 80;

interface SideQuestTrigger {
  characterId: string;
  affectionThreshold: number;
  requiredFlag?: string; // e.g., must have completed chapter 1
  completedFlag: string; // Flag set when this quest is done
  startNodeId: string; // The first node of the side quest
}

const SIDE_QUEST_TRIGGERS: SideQuestTrigger[] = [
  {
      characterId: 'senpai_A',
      affectionThreshold: 80, 
      // requiredFlag: 'chapter_1_complete', // Example dependency
      completedFlag: 'completed_senpai_A_sq1', // Must match flag set in side quest end node
      startNodeId: 'sq1_a_start',
  },
  // Add triggers for other characters/quests here
];

export const determineAndTriggerEnding = (): GameStateModifier =>
  (gameState, characterState) => {
    console.log("Determining ending...");

    const setActiveEnding = useGameStore.getState().setActiveEnding;
    let bestEndingId: string = 'normal_end'; // Default to normal end
    let highestAffection = -1;

    // Find the love interest with the highest affection
    Object.keys(characterState.characters).forEach((charId) => {
        const charData = CHARACTERS_DATA[charId];
        const charRuntimeState = characterState.characters[charId];

        if (charData?.isLoveInterest && charRuntimeState) {
            console.log(`Checking ${charData.name}, Affection: ${charRuntimeState.affection}`);
            if (charRuntimeState.affection > highestAffection) {
                highestAffection = charRuntimeState.affection;
                // Tentatively set the ending ID based on highest affection
                // Assume ending ID follows a pattern like `${charId}_good`
                if (highestAffection >= MIN_AFFECTION_FOR_GOOD_END) {
                   bestEndingId = `${charId}_good`; // Potential good end ID
                } else {
                    // If highest affection is below threshold, revert to normal
                    bestEndingId = 'normal_end';
                }
            } else if (charRuntimeState.affection === highestAffection && highestAffection >= MIN_AFFECTION_FOR_GOOD_END) {
                 // Handle ties? Maybe prioritize certain characters or lead to a harem end (if designed)
                 // For now, let's just stick with the first one found or default to normal if tie occurs at threshold
                 console.log("Affection tie detected, potentially reverting to normal end or specific tie-breaker needed.");
                 // bestEndingId = 'harem_end'; // Or specific tie logic
                 bestEndingId = 'normal_end'; // Simple: tie reverts to normal
            }
        }
    });

     // Final check: Ensure the chosen ending exists if it's character specific
     if (bestEndingId !== 'normal_end' && !ENDINGS_DATA[bestEndingId]) {
          console.warn(`Determined ending ID ${bestEndingId} not found in ENDINGS_DATA. Falling back to normal_end.`);
          bestEndingId = 'normal_end';
     }


    console.log(`Final Ending Determined: ${bestEndingId} (Highest Affection: ${highestAffection})`);

    // Trigger the ending display
    setActiveEnding(bestEndingId);
  };

export const checkAndTriggerSideQuests = (defaultNextNodeId: string | null): GameStateModifier =>
  (gameState, characterState) => {
      if (gameState.isInSideQuest) {
          console.log("Already in a side quest, skipping trigger check.");
          return; // Don't trigger if already in one
      }

      if (!defaultNextNodeId) {
           console.error("checkAndTriggerSideQuests called without a defaultNextNodeId.");
           return; // Cannot determine return point
      }

      for (const trigger of SIDE_QUEST_TRIGGERS) {
          const currentAffection = characterState.characters[trigger.characterId]?.affection ?? 0;
          const hasCompleted = gameState.gameFlags[trigger.completedFlag] === true;
          const meetsRequiredFlag = !trigger.requiredFlag || gameState.gameFlags[trigger.requiredFlag] === true;

          // Check conditions
          if (
              !hasCompleted &&
              meetsRequiredFlag &&
              currentAffection >= trigger.affectionThreshold
          ) {
              // Trigger found!
              console.log(`Triggering side quest for ${trigger.characterId}`);
              // Use the provided defaultNextNodeId as the return point
              useGameStore.getState().startSideQuest(trigger.startNodeId, defaultNextNodeId);
              return; // Trigger only one quest per check
          }
      }
      console.log("No side quests triggered at this checkpoint.");
      // If no quest triggered, the game naturally proceeds based on the checkpoint node's nextNodeId
  };

// --- Effect Functions ---

export const increaseAffection = (characterId: string, amount: number): GameStateModifier =>
  () => {
    useCharacterStore.getState().increaseAffection(characterId, amount);
  };

export const decreaseAffection = (characterId: string, amount: number): GameStateModifier =>
  () => {
    useCharacterStore.getState().decreaseAffection(characterId, amount);
  };

export const setMetCharacter = (characterId: string): GameStateModifier =>
  () => {
    useCharacterStore.getState().setHasMet(characterId, true);
  };

export const setGameFlag = (flagName: string, value: boolean | number | string): GameStateModifier =>
  () => {
    useGameStore.getState().setGameFlag(flagName, value);
  };

// --- Condition Functions ---

export const hasMet = (characterId: string): ConditionChecker =>
  (_, characterState) => { // GameState not needed here
    return characterState.characters[characterId]?.hasMet ?? false;
  };

export const affectionAbove = (characterId: string, threshold: number): ConditionChecker =>
  (_, characterState) => {
    return (characterState.characters[characterId]?.affection ?? 0) > threshold;
  };

export const affectionBelow = (characterId: string, threshold: number): ConditionChecker =>
  (_, characterState) => {
    return (characterState.characters[characterId]?.affection ?? 0) < threshold;
  };

export const checkGameFlag = (flagName: string, expectedValue: any = true): ConditionChecker =>
  (gameState) => {
      return gameState.gameFlags[flagName] === expectedValue;
  };

// --- Combine multiple effects ---
// Helper to create an array of effects easily
export const effects = (...modifiers: GameStateModifier[]): GameStateModifier[] => modifiers;