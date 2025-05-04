import type { StoryData } from '../../types';
import {
  increaseAffection,
  setMetCharacter,
  setGameFlag,
  hasMet,
  affectionAbove,
  effects, 
  decreaseAffection,
  checkAndTriggerSideQuests,
  determineAndTriggerEnding
} from '../../utils/storyHelpers';

export const MAIN_STORY: StoryData = {
  'start': {
    id: 'start',
    sceneId: 'black_screen',
    text: [
        '微風拂過臉頰，帶著夏日的氣息。',
        '今天，是我大學生活的第一天，也是我選修了網球體育課的第一天。',
        '「希望能順利通過體育課呀...」',
    ],
    nextNodeId: 'arrive_court',
    audio: { bgm: 'bgm_peaceful.mp3' } 
  },
  'arrive_court': {
      id: 'arrive_court',
      sceneId: 'tennis_court_day',
      text: '（深吸一口氣，踏入了網球場...好多人啊。）',
      nextNodeId: 'meet_coach_A_1',
  },
  'meet_coach_A_1': {
    id: 'meet_coach_A_1',
    sceneId: 'tennis_court_day',
    characterId: 'coach',
    spriteExpression: 'default',
    text: [
      '歡迎大家選修體育課，我是體育課老師。',
      '欸那邊那位同學，有事嗎？',
      '「這老師感覺好可怕...」',
  ],
    effects: effects(setMetCharacter('coach')),
    nextNodeId: 'meet_coach_A_2',
  },
  'meet_coach_A_2': {
    id: 'meet_coach_A_2',
    sceneId: 'tennis_court_day',
    text: [
      '「先好好練好正拍吧...」',
      '同學小心球 !!! (網球快速朝臉飛來)',
      '(快速閃身!!!)',
      '「好險我反應很快...」',
      '「搞什麼東西啊(╬☉д⊙)」',
  ],
    nextNodeId: 'meet_coach_A_3',
  },
  'meet_coach_A_3': {
    id: 'meet_coach_A_3',
    sceneId: 'tennis_court_day',
    spriteExpression: 'default',
    characterId: 'coach',
    text: [
      '那邊那位同學，沒事齁？',
      '「我...我沒事。」',
      '我看妳反應很快，不然就不用戴牙套了。',
      '(媽逼得有禮貌嗎你)',
  ],
    nextNodeId: 'meet_coach_A_4',
  },
  'meet_coach_A_4': {
    id: 'meet_coach_A_4',
    sceneId: 'tennis_court_day',
    characterId: 'coach',
    spriteExpression: 'default',
    text: '哈哈哈開玩笑的，我看妳骨骼驚奇，有興趣來網球隊試試看嗎？',
    choices: [
      {
        text: '「當然啦，我鐵定有天分的。」',
        nextStoryNodeId: 'coach_A_react_1',
        effects: effects(increaseAffection('coach', 5), setGameFlag('player_introduced', true)), 
      },
      {
        text: '「摁....可以試試看」',
        nextStoryNodeId: 'coach_A_react_1',
        effects: effects(setGameFlag('coach', true)),
      },
       {
        text: '「不要。」',
        nextStoryNodeId: 'final_day_checkpoint',
      },
    ],
  },
  'coach_A_react_1': {
    id: 'coach_A_react_1',
    sceneId: 'tennis_court_day',
    characterId: 'coach',
    spriteExpression: 'happy',
    text: [
      '喔？不錯歐，有慧根。',
      '你剛好可以從球經開始當，等等先去幫我買竹林雞肉飯。',
      '「歐...歐歐好的教練」',
      '很好，對了我們練球是一三晚上7點，記得要提早來熱身。',
      '「好的。」',
  ],
    nextNodeId: 'meet_coach_A_5',
  },
  'meet_coach_A_5': {
    id: 'meet_coach_A_5',
    sceneId: 'tennis_court_day',
    text: [
      '「真是奇怪的教練..」',
      '「今天剛好是禮拜一，晚上去看看吧。」',
      '(順便看看有什麼帥哥(,,Ծ 3 Ծ,,))',
      '「哎呀不想了，還是先去買雞肉飯吧。」',
      '此時肉泥立下了一個決定，人生單身到此一定要在校隊撈一個男生才可以!!',
  ],
    nextNodeId: 'common_night',
  },

  'common_night': {
    id: 'common_night',
    sceneId: 'tennis_court_night',
    text: '（到了晚上)',
    nextNodeId: 'day_0_training',
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
      nextNodeId: 'end_intro_sequence_confront',
      audio: { bgm: 'stop' } // 停止 BGM 或換成別的
  },
   'end_intro_sequence_confront': {
      id: 'end_intro_sequence_confront',
      sceneId: 'tennis_court_day',
      characterId: 'classmate_B',
      spriteExpression: 'angry',
      text: '嘖...麻煩的新人。',
      nextNodeId: 'checkpoint_end_of_day_1', // 回到共同結尾
  },

  'checkpoint_end_of_day_1': {
    id: 'checkpoint_end_of_day_1',
    sceneId: 'school_gate', // Or player's room etc.
    text: "（第一天就這樣結束了...）",
    effects: effects(
        // *** Call the check function here ***
         // Pass the current node ID so the helper can potentially find the *intended* next node
        checkAndTriggerSideQuests('checkpoint_end_of_day_1')
    ),
    // IMPORTANT: nextNodeId here is the DEFAULT path if NO side quest triggers.
    // The checkAndTriggerSideQuests effect will override the story node jump if a quest starts.
    nextNodeId: 'start_of_day_2', // Default next node if no side quest triggers
},

'start_of_day_2': {
     id: 'start_of_day_2',
     sceneId: 'classroom',
     text: '第二天。',
     // ...
     nextNodeId: 'day_2_event_1',
},

// Example Main Story Content Conditional on Affection
'day_2_event_1': {
    id: 'day_2_event_1',
    sceneId: 'classroom',
    text: '來到教室，看到 A 前輩也在。',
    choices: [
        { text: "主動上前打招呼", nextStoryNodeId: 'final_day_checkpoint' },
        {
            text: "「早安，前輩！」(需要好感度)",
            condition: affectionAbove('senpai_A', 30), // Condition based on affection
            nextStoryNodeId: 'day_2_greet_A_friendly',
            effects: effects(increaseAffection('senpai_A', 2))
        },
         { text: "默默坐到自己的位置上", nextStoryNodeId: 'final_day_checkpoint' },
    ]
},
 'day_2_greet_A_friendly': {
     id: 'day_2_greet_A_friendly',
     sceneId: 'classroom',
     characterId: 'senpai_A',
     spriteExpression: 'happy',
     text: "哦！肉泥早啊！今天也很有精神嘛！",
     nextNodeId: 'day_2_sit_down', // Continue main flow
 },

 'final_day_checkpoint': {
  id: 'final_day_checkpoint',
  sceneId: 'school_gate', // Example scene
  text: "時間過得真快，大學生活似乎即將迎來一個結果...",
  effects: effects(
      determineAndTriggerEnding() // Call the ending determination logic
  ),
  // No nextNodeId here, the effect handles the state change
  nextNodeId: undefined,
},
};