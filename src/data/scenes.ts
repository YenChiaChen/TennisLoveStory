import type { Scene } from '../types';

// 範例場景數據
// 務必將圖片路徑換成你實際存放資源的路徑 (建議放在 public/assets/images/backgrounds/)
export const SCENES_DATA: Record<string, Scene> = {
  'tennis_court_day': {
    id: 'tennis_court_day',
    name: '網球場 (白天)',
    backgroundPath: '/assets/images/backgrounds/tennis_court_day.jpg', // 替換成實際路徑
  },
  'classroom': {
    id: 'classroom',
    name: '教室',
    backgroundPath: '/assets/images/backgrounds/classroom.jpg', // 替換成實際路徑
  },
  'school_gate': {
    id: 'school_gate',
    name: '校門口',
    backgroundPath: '/assets/images/backgrounds/school_gate.jpg', // 替換成實際路徑
  },
  'black_screen': { // 特殊場景，用於轉場或旁白
      id: 'black_screen',
      name: '黑畫面',
      backgroundPath: '', // 或者一個純黑的圖片
  }
};

// Helper to get scene data by ID
export const getSceneById = (id: string): Scene | undefined => SCENES_DATA[id];