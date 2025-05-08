
import { CharacterStoreState } from '../store/useCharacterStore';
import { CharacterSprites } from './character';
import { GameState } from './gameState';


// Type for functions that modify game state (used in effects and conditions)
export type GameStateModifier = (
  gameState: GameState,
  characterState: CharacterStoreState // Pass the whole character state store for flexibility
) => void; // Or return partial state for Zustand set

export type ConditionChecker = (
  gameState: GameState,
  characterState: CharacterStoreState
) => boolean;

export interface Choice {
  text: string; // Text displayed on the choice button
  nextStoryNodeId: string; // ID of the node to jump to if chosen
  condition?: ConditionChecker; // Optional function to determine if choice is visible/enabled
  effects?: GameStateModifier[]; // Optional array of functions to execute when chosen
}

export interface StoryNode {
  id: string; // Unique ID for this node (e.g., "chapter1_intro_1")
  nodeType?: 'dialogue' | 'eventTitle'
  sceneId: string; // Background scene ID from src/data/scenes.ts
  characterId?: string; // ID of the speaking character (from src/data/characters.ts), null/undefined for narration
  spriteExpression?: keyof CharacterSprites; // Expression key (e.g., 'happy', 'default')
  text: string | string[]; // Dialogue text (string array for multi-part dialogue)
  choices?: Choice[]; // Array of player choices
  eventTitleText?: string;
  nextNodeId?: string; // Default next node ID if no choices or auto-advance
  triggerMiniGameId?: string; // Optional: ID of a mini-game to start after this node
  effects?: GameStateModifier[]; // Optional array of functions to execute upon entering this node
  audio?: { // Optional audio cues
    bgm?: string; // Path or ID for background music to start/change
    sfx?: string; // Path or ID for a sound effect to play
  };
}

// Structure for how story data might be organized in files
export type StoryData = Record<string, StoryNode>;