// src/data/messageTriggers.ts
import type { MessageTrigger } from '../types';
import { affectionAbove, checkGameFlag } from '../utils/storyHelpers';

// 定義所有可能的訊息觸發事件
export const MESSAGE_TRIGGERS: MessageTrigger[] = [
  {
    id: 'msg_senpai_A_day2',
    characterId: 'senpai_A',
    day: 2,
    condition: affectionAbove('senpai_A', 0), 
    startNodeId: 'msg_sa_d2_start',
    title: "關於昨天的練習..."
  },
  {
    id: 'msg_classmate_B_day4',
    characterId: 'classmate_B',
    day: 4,
    condition: (gameState, charState) => {
        // 組合多個條件
        return charState.characters['classmate_B']?.affection > 10 &&
               gameState.gameFlags['player_apologized_to_B'] === true; // 假設有這個旗標
    },
    startNodeId: 'msg_cb_d4_start',
    title: "有事問你。"
  },
  // Add more triggers...
];