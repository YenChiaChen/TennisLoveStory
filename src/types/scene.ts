import type { ConditionChecker } from './story'; 

export interface Scene {
  id: string;
  name: string;
  backgroundPath: string;
  accessibleViaMap?: boolean; // New: Can this scene be accessed from the map?
  mapLabel?: string; // New: Text displayed on the map for this location
  miniGameId?: string; // New: ID of the minigame triggered here
  miniGameCondition?: ConditionChecker; // New: Condition to trigger the minigame
  // storyNodeOnArrival?: string; // Optional: Story node triggered upon arriving via map (if not a minigame)
}