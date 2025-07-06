// src/data/messages/senpai_A_messages.ts
import type { StoryData } from '../../types';
import { effects, increaseAffection, setGameFlag } from '../../utils/storyHelpers';

export const SENPAI_A_MESSAGES: StoryData = {
  msg_sa_d2_start: {
    id: 'msg_sa_d2_start',
    sceneId: 'phone_screen',
    characterId: 'senpai_A',
    text: "嗨，肉泥！昨天練習辛苦啦！",
    typingDelay: 1200,
    choices: [
      { text: "前輩也辛苦了！你超帥的！", nextStoryNodeId: 'msg_sa_d2_reply_positive' }, // 指向正面回覆
      { text: "嗯。", nextStoryNodeId: 'msg_sa_d2_reply_neutral' }, // 指向中性回覆
    ]
  },

  // --- NPC 對「正面回覆」的回應 ---
  msg_sa_d2_reply_positive: {
    id: 'msg_sa_d2_reply_positive',
    sceneId: 'phone_screen',
    characterId: 'senpai_A',
    text: "咦？超、超帥的嗎？哈哈，謝謝妳！被妳這麼一說，今天的練習更有動力了！",
    typingDelay: 2500,
    effects: effects(increaseAffection('senpai_A', 5)), // 好感度大幅增加
    nextNodeId: 'msg_sa_d2_positive_followup' // NPC 可能會繼續說
  },
  msg_sa_d2_positive_followup: {
    id: 'msg_sa_d2_positive_followup',
    sceneId: 'phone_screen',
    characterId: 'senpai_A',
    text: "明天也一起加油吧！💪",
    typingDelay: 1000,
    effects: effects(
        setGameFlag('msg_senpai_A_day2_complete', true)
    ),
  },

  // --- NPC 對「中性回覆」的回應 ---
  'msg_sa_d2_reply_neutral': {
    id: 'msg_sa_d2_reply_neutral',
    sceneId: 'phone_screen',
    characterId: 'senpai_A',
    text: "好喔，要好好休息啊。",
    typingDelay: 1500,
   effects: effects(
        setGameFlag('msg_senpai_A_day2_complete', true) 
    ),
  },
};