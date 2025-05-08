// src/types/calendar.ts
export interface CalendarEvent {
    id: string; // Unique event ID
    day: number; // Day the event occurs on
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'any'; // Optional: Specific time slot
    title: string; // Event title shown in list
    description?: string; // More details (optional)
    locationId?: string; // Scene ID where it happens (optional)
    relatedCharacterId?: string; // Character involved (optional)
    isMajorEvent?: boolean; // Flag for important story events (optional)
    icon?: string; // e.g., '📅', '🎾', '📚' (optional)
  }


  
  
