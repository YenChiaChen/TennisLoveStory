import { useCharacterStore } from '../store/useCharacterStore';

// This engine could become more complex if relationship changes
// depend on multiple factors (player stats, items, time of day etc.)
// For now, it might just centralize the calls to the store.

export class RelationshipEngine {
  constructor() {
    console.log("RelationshipEngine Initialized");
  }

  // Example: Modify affection with clamping and potential logging/events
  changeAffection(characterId: string, amount: number): void {
    if (!useCharacterStore.getState().characters[characterId]) {
      console.warn(`Attempted to change affection for unknown character: ${characterId}`);
      return;
    }

    console.log(`Changing affection for ${characterId} by ${amount}`);
    // Uses the actions defined in the store which already handle clamping
    if (amount > 0) {
      useCharacterStore.getState().increaseAffection(characterId, amount);
    } else if (amount < 0) {
       useCharacterStore.getState().decreaseAffection(characterId, Math.abs(amount));
    }

    // You could add logic here to trigger events when thresholds are met
    // e.g., if (newAffection > 70 && oldAffection <= 70) { triggerEvent('FriendZoneExit'); }
  }

  setMetStatus(characterId: string, hasMet: boolean): void {
      if (!useCharacterStore.getState().characters[characterId]) {
      console.warn(`Attempted to set met status for unknown character: ${characterId}`);
      return;
    }
     useCharacterStore.getState().setHasMet(characterId, hasMet);
  }

  getAffection(characterId: string): number {
    return useCharacterStore.getState().characters[characterId]?.affection ?? 0;
  }

   hasMet(characterId: string): boolean {
     return useCharacterStore.getState().characters[characterId]?.hasMet ?? false;
   }
}

// export const relationshipEngine = new RelationshipEngine();