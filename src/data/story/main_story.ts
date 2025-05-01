import type { StoryData } from '../../types';
import {
  increaseAffection,
  setMetCharacter,
  setGameFlag,
  hasMet,
  affectionAbove,
  effects, // Import the helper
  decreaseAffection
} from '../../utils/storyHelpers'; // Import helper functions

// 範例主線故事開頭
export const MAIN_STORY: StoryData = {
  'start': {
    id: 'start',
    sceneId: 'black_screen',
    text: [
        '微風拂過臉頰，帶著夏日的氣息。',
        '今天，是我大學生活的第一天，也是我加入網球隊的第一天。',
        '「希望能交到新朋友啊...」',
    ],
    nextNodeId: 'arrive_court',
    audio: { bgm: 'bgm_peaceful.mp3' } // 假設的背景音樂
  },
  'arrive_court': {
      id: 'arrive_court',
      sceneId: 'tennis_court_day',
      text: '（深吸一口氣，踏入了網球場...好多人啊。）',
      nextNodeId: 'meet_senpai_A_1',
  },
  'meet_senpai_A_1': {
    id: 'meet_senpai_A_1',
    sceneId: 'tennis_court_day',
    characterId: 'senpai_A',
    spriteExpression: 'happy',
    text: '哦？妳是新來的學妹吧？歡迎加入網球隊！',
    effects: effects(setMetCharacter('senpai_A')), // 標記已遇見前輩A
    nextNodeId: 'meet_senpai_A_2',
  },
  'meet_senpai_A_2': {
    id: 'meet_senpai_A_2',
    sceneId: 'tennis_court_day',
    characterId: 'senpai_A',
    spriteExpression: 'default',
    text: '我是隊長，叫我 A 前輩就可以了。妳叫什麼名字？',
    choices: [
      {
        text: '「前輩好！我叫肉泥，請多指教！」',
        nextStoryNodeId: 'senpai_A_react_1',
        effects: effects(increaseAffection('senpai_A', 5), setGameFlag('player_introduced', true)), // 增加好感度 + 設置旗標
      },
      {
        text: '「...肉泥。」(小聲)',
        nextStoryNodeId: 'senpai_A_react_2',
        effects: effects(setGameFlag('player_introduced', true)), // 只設置旗標
      },
       {
        text: '（太緊張了說不出話）',
        nextStoryNodeId: 'senpai_A_react_3',
         // No effects initially
      },
    ],
  },
  'senpai_A_react_1': {
    id: 'senpai_A_react_1',
    sceneId: 'tennis_court_day',
    characterId: 'senpai_A',
    spriteExpression: 'happy',
    text: '肉泥嗎？好名字！很有活力嘛，不錯不錯！',
    nextNodeId: 'intro_common_path',
  },
  'senpai_A_react_2': {
    id: 'senpai_A_react_2',
    sceneId: 'tennis_court_day',
    characterId: 'senpai_A',
    spriteExpression: 'default', // 可以是疑惑或其他表情
    text: '肉泥是吧，聲音有點小喔，拿出精神來！打網球需要活力！',
    nextNodeId: 'intro_common_path',
     effects: effects(increaseAffection('senpai_A', 1)), // 稍微增加一點點
  },
  'senpai_A_react_3': {
    id: 'senpai_A_react_3',
    sceneId: 'tennis_court_day',
    characterId: 'senpai_A',
    spriteExpression: 'default',
    text: '嗯？怎麼了，不用緊張啦！放輕鬆就好。妳先旁邊看看熟悉一下環境？',
    nextNodeId: 'intro_common_path',
    effects: effects(decreaseAffection('senpai_A', 2)), // 稍微降低好感度
  },

  'intro_common_path': {
    id: 'intro_common_path',
    sceneId: 'tennis_court_day',
    text: '（就在這時，旁邊傳來一個冷淡的聲音。）',
    nextNodeId: 'meet_classmate_B_1',
  },

  'meet_classmate_B_1': {
    id: 'meet_classmate_B_1',
    sceneId: 'tennis_court_day',
    characterId: 'classmate_B',
    spriteExpression: 'default', // 可能需要一個 'annoyed' 或 'neutral' 表情
    text: '喂，新來的，擋到路了。',
    effects: effects(setMetCharacter('classmate_B')),
    nextNodeId: 'meet_classmate_B_2',
  },
   'meet_classmate_B_2': {
    id: 'meet_classmate_B_2',
    sceneId: 'tennis_court_day',
    characterId: 'senpai_A',
    spriteExpression: 'default', // 可以是無奈或試圖緩和氣氛的表情
    text: '哈哈，B 同學還是老樣子這麼直接啊。她是妳的同級生，之後多交流喔。',
     choices: [
      {
        text: '「是、是的...」(默默移開)',
        nextStoryNodeId: 'end_intro_sequence',
      },
      {
        text: '「抱歉！」(趕緊讓開)',
        nextStoryNodeId: 'end_intro_sequence',
        effects: effects(increaseAffection('classmate_B', 1)), // B 可能欣賞直接的人
      },
       {
        text: '瞪回去',
        condition: affectionAbove('senpai_A', 22), // 只有和前輩關係稍微好一點才敢？(範例)
        nextStoryNodeId: 'end_intro_sequence_confront',
        effects: effects(decreaseAffection('classmate_B', 5)),
      },
    ]
  },
  'end_intro_sequence': {
      id: 'end_intro_sequence',
      sceneId: 'tennis_court_day',
      text: '（感覺前途多難...總之，我的大學網球隊生活，就這樣開始了。）',
      // nextNodeId: 'go_to_chapter_2' // 指向下一個主要劇情節點
      nextNodeId: undefined,
      audio: { bgm: 'stop' } // 停止 BGM 或換成別的
  },
   'end_intro_sequence_confront': {
      id: 'end_intro_sequence_confront',
      sceneId: 'tennis_court_day',
      characterId: 'classmate_B',
      spriteExpression: 'angry',
      text: '嘖...麻煩的新人。',
      nextNodeId: 'end_intro_sequence', // 回到共同結尾
  },
};