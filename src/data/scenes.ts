import type { Scene } from '../types';
import { affectionAbove, hasMet } from '../utils/storyHelpers';
// 範例場景數據
// 務必將圖片路徑換成你實際存放資源的路徑 (建議放在 public/assets/images/backgrounds/)
export const SCENES_DATA: Record<string, Scene> = {
  'tennis_court_day': {
    id: 'tennis_court_day',
    name: '網球場 (白天)',
    backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276527/bg-tennis-court_cki0so.png', 
    //accessibleViaMap: true, // 可從地圖進入
    //mapLabel: '前往網球場練習', // 地圖上顯示的文字
    //miniGameId: 'tennis_rally', // 觸發網球小遊戲
    //miniGameCondition: hasMet('senpai_A'), // 條件：必須見過前輩 A
  },
  'classroom': {
    id: 'classroom',
    name: '教室',
    backgroundPath: '/assets/images/backgrounds/classroom.jpg', 
  },
  'school_gate': {
    id: 'school_gate',
    name: '校門口',
    backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276526/bg-school_pa8x70.png', 
  },
  'black_screen': { // 特殊場景，用於轉場或旁白
      id: 'black_screen',
      name: '黑畫面',
      backgroundPath: '', // 或者一個純黑的圖片
  },
  'tennis_court_night': { 
      id: 'tennis_court_night',
      name: '網球場 (晚上)',
      backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746295696/bg-tennis-court-night_oimqf3.png', 
  },
  'library': {
      id: 'library',
      name: '圖書館',
      backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276526/bg-library_qmrdl2.png', // 替換成實際路徑
      //accessibleViaMap: true,
      //mapLabel: '去圖書館讀書',
      //miniGameId: 'study_quiz', // 觸發讀書小遊戲
      //miniGameCondition: affectionAbove('classmate_B', 15), // 條件：B 同學好感度 > 15
  },
};

// Helper to get scene data by ID
export const getSceneById = (id: string): Scene | undefined => SCENES_DATA[id];