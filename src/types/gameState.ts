import { ActiveMessageConversation, MessageHistoryItem } from "../store";

// Represents the core, persistent state of the game progress
type MiniGameReturnContext = 'story' | 'map' | null;

export interface AffectionAnimationItem {
  id: number; // Unique ID for React key and managing removal
  characterId: string;
  amount: number; // Positive for increase, negative for decrease
}
export interface GameState {
    currentStoryNodeId: string | null;
    currentSceneId: string | null; // Can be derived from StoryNode, but sometimes useful standalone
    activeMiniGameId: string | null; // ID of the currently active mini-game
    gameFlags: Record<string, boolean | number | string>; // Flexible flags for tracking story events/conditions
    miniGameReturnContext: MiniGameReturnContext; 
    isInSideQuest: boolean; // New: Are we currently in a side quest?
    returnStoryNodeId: string | null; // New: Node to return to after side quest
    activeEndingId: string | null;
    affectionAnimationQueue: AffectionAnimationItem[];
    isPhoneUnlocked: boolean; // New: 手機功能是否已解鎖
    isPhoneOpen: boolean;     // New: 手機介面是否打開 (Runtime state)
    currentDay: number;       // New: 遊戲中的當前天數
    unreadMessages: string[]; // Array of unread MessageTrigger IDs
    readMessages: string[];   // Array of read MessageTrigger IDs
    activeMessageConversation: ActiveMessageConversation | null; // The currently open conversation
    conversationHistories: Record<string, MessageHistoryItem[]>;
  }
  
  // Represents non-persistent runtime state, often managed by specific components/hooks
  export interface GameRuntimeState {
    isDialogueBoxVisible: boolean;
    isChoiceBoxVisible: boolean;
    isAutoPlaying: boolean;
    isSkipping: boolean;
    // ... other UI or temporary states
  }
  
  export interface SettingsState {
    masterVolume: number; // 0-1
    bgmVolume: number; // 0-1
    sfxVolume: number; // 0-1
    voiceVolume: number; // 0-1 (if adding voice)
    textSpeed: number; // Multiplier (e.g., 1 = normal, 1.5 = faster)
    autoPlayDelay: number; // Delay in seconds for auto-play
  }