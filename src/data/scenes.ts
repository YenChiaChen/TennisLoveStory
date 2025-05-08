import type { Scene } from '../types';
import { affectionAbove, hasMet } from '../utils/storyHelpers';
// 範例場景數據
// 務必將圖片路徑換成你實際存放資源的路徑 (建議放在 public/assets/images/backgrounds/)
export const SCENES_DATA: Record<string, Scene> = {
  'tennis_court_day': {
    id: 'tennis_court_day',
    name: '網球場 (白天)',
    backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366778/bg-tennis-court_rkoxu1.webp', 
    //accessibleViaMap: true, // 可從地圖進入
    //mapLabel: '前往網球場練習', // 地圖上顯示的文字
    //miniGameId: 'tennis_rally', // 觸發網球小遊戲
    //miniGameCondition: hasMet('senpai_A'), // 條件：必須見過前輩 A
  },
  'lake': {
    id: 'lake',
    name: '烏龜池',
    backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366775/bg-lake_irhliq.webp', 
  },
  'school_gate': {
    id: 'school_gate',
    name: '校門口',
    backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366777/bg-school_lwlajv.webp', 
  },
  'black_screen': { // 特殊場景，用於轉場或旁白
      id: 'black_screen',
      name: '黑畫面',
      backgroundPath: '', // 或者一個純黑的圖片
  },
  'tennis_court_night': { 
      id: 'tennis_court_night',
      name: '網球場 (晚上)',
      backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366778/bg-tennis-court-night_uwcp50.webp', 
  },
  'library': {
      id: 'library',
      name: '圖書館',
      backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366946/bg-library_g1zpoj.webp', // 替換成實際路徑
      //accessibleViaMap: true,
      //mapLabel: '去圖書館讀書',
      //miniGameId: 'study_quiz', // 觸發讀書小遊戲
      //miniGameCondition: affectionAbove('classmate_B', 15), // 條件：B 同學好感度 > 15
  },
  'ktv': { 
      id: 'ktv',
      name: 'KTV室',
      backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366779/ChatGPT_Image_2025%E5%B9%B45%E6%9C%884%E6%97%A5_%E4%B8%8A%E5%8D%8801_19_20_dhbnbe.webp', 
  },
  'court': { 
      id: 'court',
      name: '操場',
      backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366773/bg-court_nohtcs.webp', 
  },
  'race': { 
      id: 'race',
      name: '大專盃場地',
      backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366784/ChatGPT_Image_2025%E5%B9%B45%E6%9C%884%E6%97%A5_%E4%B8%8A%E5%8D%8801_19_202_q0b2mg.webp', 
  },
  'restuarant': { 
      id: 'restuarant',
      name: '難吃的吃到飽',
      backgroundPath: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366954/ChatGPT_Image_2025%E5%B9%B45%E6%9C%884%E6%97%A5_%E4%B8%8A%E5%8D%884_kjelfy.webp', 
  },
};

// Helper to get scene data by ID
export const getSceneById = (id: string): Scene | undefined => SCENES_DATA[id];