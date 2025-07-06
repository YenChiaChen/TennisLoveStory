import type { ConditionChecker } from './story';

export interface MessageTrigger {
  id: string; // 唯一的訊息觸發器 ID, e.g., 'senpai_A_ask_out'
  characterId: string; // 發送者 ID
  day: number; // 在第幾天觸發
  condition: ConditionChecker; // 觸發條件 (親密度、遊戲旗標等)
  startNodeId: string; // 對話開始的 StoryNode ID
  title: string; // 在訊息列表中顯示的標題
}
