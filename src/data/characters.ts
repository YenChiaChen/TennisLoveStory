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
    name: '男生隊長',
    description: '陽光開朗的網球隊隊長，三年級。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276763/2_urdlc1.png', 
      happy: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276763/2_urdlc1.png',
      blushing: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276763/2_urdlc1.png',
    },
    initialAffection: 20, // 初始好感度
    isLoveInterest: true,
  },
  'coach': {
    id: 'coach',
    name: '網球隊教練',
    description: '最溫柔的網球隊教練，愛吃真善美牛肉麵。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746293249/7_xdq6da.png', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_yu': {
    id: 'classmate_yu',
    name: '馮同學',
    description: '很好相處的個性，立志要成為網球王。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276763/1_kc5jb3.png', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_yue': {
    id: 'classmate_yue',
    name: '林同學',
    description: '酷酷的個性，是網球隊的第一單打。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276763/3_jzpnw5.png', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_old': {
    id: 'classmate_old',
    name: '老不死的家哥',
    description: '沒有人知道這個人在網球隊待了多久。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276766/5_uf51yf.png', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_liao': {
    id: 'classmate_liao',
    name: '廖同學',
    description: '喜歡玩音樂遊戲，成績很好，是河濱網球王。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746293249/6_ulcksj.png', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_ma': {
    id: 'classmate_ma',
    name: '麻大哥',
    description: '看屁。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276764/4_wpqi5z.png', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_kuo': {
    id: 'classmate_kuo',
    name: '郭學長',
    description: '溫和的個性，和每個都處的很好，喜歡慢跑的帥氣學長。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746293250/8_m5odzf.png', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_B': {
    id: 'classmate_B',
    name: '同級生B',
    description: '有點酷酷的同年級隊員，似乎不 KUSO 好相處。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276764/6_mwx2nn.png', // 替換成實際路徑
      angry: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746276764/6_mwx2nn.png',
      // happy: '/assets/images/characters/classmate_B/happy.png',
    },
    initialAffection: 5,
    isLoveInterest: true,
  },
};

// Helper to get character data by ID (optional but convenient)
export const getCharacterById = (id: string): Character | undefined => CHARACTERS_DATA[id];