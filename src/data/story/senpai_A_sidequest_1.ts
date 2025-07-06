// src/data/story/senpai_A_sidequest_1.ts
// Example Side Quest for Senpai A, triggered above certain affection
import type { StoryData } from '../../types';
import { effects, increaseAffection, setGameFlag } from '../../utils/storyHelpers';
import { useGameStore } from '../../store'; // Needed for endSideQuest
// --- Merge side quest data with main story for the engine ---
// You might need a better way to manage multiple story files later
import { MAIN_STORY as M_STORY} from './main_story';
import { SENPAI_A_MESSAGES } from '../messages/senpai_A_messages';

// Effect to end the side quest
const endCurrentSideQuest: () => void = () => {
    useGameStore.getState().endSideQuest();
};

export const SENPAI_A_SIDEQUEST_1: StoryData = {
  'sq1_a_start': {
    id: 'sq1_a_start',
    sceneId: 'tennis_court_day', // Or a different scene
    characterId: 'senpai_A',
    spriteExpression: 'blushing', // Example
    text: "（看到 A 前輩一個人在練習，表情好像有點奇怪...）",
    nextNodeId: 'sq1_a_approach',
  },
  'sq1_a_approach': {
    id: 'sq1_a_approach',
    sceneId: 'tennis_court_day',
    characterId: 'senpai_A',
    spriteExpression: 'default',
    text: "哦？肉泥啊，妳怎麼來了？",
    choices: [
        { text: "「看前輩一個人在練習，有點擔心。」", nextStoryNodeId: 'sq1_a_concern', effects: effects(increaseAffection('senpai_A', 3))},
        { text: "「只是路過。」", nextStoryNodeId: 'sq1_a_casual' },
    ]
  },
  'sq1_a_concern': {
      id: 'sq1_a_concern',
      sceneId: 'tennis_court_day',
      characterId: 'senpai_A',
      spriteExpression: 'happy',
      text: "哈哈，謝啦！沒事沒事，只是在想點事情。不過，妳能關心我，我很高興喔。",
      nextNodeId: 'sq1_a_ending',
       effects: effects(increaseAffection('senpai_A', 5)),
  },
    'sq1_a_casual': {
      id: 'sq1_a_casual',
      sceneId: 'tennis_court_day',
      characterId: 'senpai_A',
      spriteExpression: 'default',
      text: "這樣啊，那妳要一起練習嗎？",
      // ... more choices leading to the end
      nextNodeId: 'sq1_a_ending',
  },

  // --- Side Quest Ending Node ---
  'sq1_a_ending': {
    id: 'sq1_a_ending',
    sceneId: 'tennis_court_day', // Or transition scene
    text: "（和前輩聊了一會兒 / 練習了一會兒...）",
    // Add effects that should happen upon completing the quest
    effects: effects(
        setGameFlag('completed_senpai_A_sq1', true), // Flag completion
        endCurrentSideQuest // CRUCIAL: Call the action to return to main story
    ),
    // nextNodeId should technically not be used here as endSideQuest handles the jump
    nextNodeId: undefined,
  },
};


export const COMBINED_STORY_DATA = { ...M_STORY, ...SENPAI_A_SIDEQUEST_1,  ...SENPAI_A_MESSAGES, };