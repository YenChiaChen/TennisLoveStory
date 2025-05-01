import type { GameStateModifier, ConditionChecker } from '../types';
import { useCharacterStore } from '../store/useCharacterStore';
import { useGameStore } from '../store/useGameStore';

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