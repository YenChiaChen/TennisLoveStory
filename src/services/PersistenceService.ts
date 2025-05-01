// Provides a low-level interface for interacting with storage.
// Useful if you want to abstract away localStorage details or potentially
// swap it for another storage mechanism later (like IndexedDB).

export class PersistenceService {
    private storage: Storage;
  
    constructor(storageMechanism: Storage = localStorage) {
      this.storage = storageMechanism;
      console.log("PersistenceService Initialized using", storageMechanism.constructor.name);
    }
  
    setItem<T>(key: string, value: T): boolean {
      try {
        const serializedValue = JSON.stringify(value);
        this.storage.setItem(key, serializedValue);
        return true;
      } catch (error) {
        console.error(`Error setting item '${key}':`, error);
        return false;
      }
    }
  
    getItem<T>(key: string): T | null {
      try {
        const serializedValue = this.storage.getItem(key);
        if (serializedValue === null) {
          return null;
        }
        return JSON.parse(serializedValue) as T;
      } catch (error) {
        console.error(`Error getting item '${key}':`, error);
        return null;
      }
    }
  
    removeItem(key: string): void {
      try {
        this.storage.removeItem(key);
      } catch (error) {
        console.error(`Error removing item '${key}':`, error);
      }
    }
  
    clearAll(): void {
      try {
        // Be very careful with this! It clears EVERYTHING in the storage.
        // Might be better to clear specific keys related to the game.
        console.warn("Clearing all persistence data!");
        this.storage.clear();
      } catch (error) {
        console.error("Error clearing storage:", error);
      }
    }
  
    // Example: Clear only game-related keys
    clearGameData(prefix: string = 'rohnin-'): void {
        console.warn(`Clearing game data with prefix '${prefix}'...`);
        try {
            Object.keys(this.storage).forEach(key => {
                if (key.startsWith(prefix)) {
                    this.removeItem(key);
                    console.log(`Removed: ${key}`);
                }
            });
        } catch (error) {
            console.error("Error clearing game data:", error);
        }
    }
  }
  
  // export const persistenceService = new PersistenceService();