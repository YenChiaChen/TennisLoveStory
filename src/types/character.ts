export interface CharacterSprites {
    default: string; // Path to default sprite image
    happy?: string;
    sad?: string;
    angry?: string;
    blushing?: string;
    // Add other expressions as needed
  }
  
  export interface Character {
    id: string; // Unique identifier (e.g., 'senpai_A', 'rival_B')
    name: string; // Display name
    description?: string; // Optional description
    sprites: CharacterSprites; // Paths to sprite images for different expressions
    initialAffection: number; // Starting affection level (e.g., 0-100)
    isLoveInterest: boolean; // Can this character be romanced?
  }
  
  // Represents the runtime state of a character in the game
  export interface CharacterRuntimeState {
    affection: number;
    hasMet: boolean;
    // Add other dynamic states like relationship phase, specific flags, etc.
  }