import type { Character } from '../types';

// 範例角色數據
// 務必將圖片路徑換成你實際存放資源的路徑 (建議放在 public/assets/images/characters/)
export const CHARACTERS_DATA: Record<string, Character> = {
  'player': {
    id: 'player',
    name: '肉泥', // 玩家名字可能後續可自訂
    sprites: { // 玩家通常不需要立繪，但保留結構
      default: '',
    },
    initialAffection: 0, // 玩家通常沒有好感度
    isLoveInterest: false,
  },
  'senpai_A': {
    id: 'senpai_A',
    name: '網球前輩A',
    description: '陽光開朗的網球隊隊長，三年級。',
    sprites: {
      default: '/assets/images/characters/senpai_A/default.png', // 替換成實際路徑
      happy: '/assets/images/characters/senpai_A/happy.png',
      blushing: '/assets/images/characters/senpai_A/blushing.png',
      // sad: '/assets/images/characters/senpai_A/sad.png',
    },
    initialAffection: 20, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_B': {
    id: 'classmate_B',
    name: '同級生B',
    description: '有點酷酷的同年級隊員，似乎不 KUSO 好相處。',
    sprites: {
      default: '/assets/images/characters/classmate_B/default.png', // 替換成實際路徑
      angry: '/assets/images/characters/classmate_B/angry.png',
      // happy: '/assets/images/characters/classmate_B/happy.png',
    },
    initialAffection: 5,
    isLoveInterest: true,
  },
};

// Helper to get character data by ID (optional but convenient)
export const getCharacterById = (id: string): Character | undefined => CHARACTERS_DATA[id];