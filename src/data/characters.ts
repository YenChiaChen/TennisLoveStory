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
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366517/2_zksuic.webp', 
    },
    initialAffection: 0,
    isLoveInterest: true,
  },
  'coach': {
    id: 'coach',
    name: '網球隊教練',
    description: '最溫柔的網球隊教練，愛吃真善美牛肉麵。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366524/222_vrvdtx.webp', 
    },
    initialAffection: 0,
    isLoveInterest: true,
  },
  'all': {
    id: 'all',
    name: '眾人',
    description: '',
    sprites: {
      default: '', 
    },
    initialAffection: 5,
    isLoveInterest: false,
  },
  'classmate_yu': {
    id: 'classmate_yu',
    name: '馮同學',
    description: '很好相處的個性，立志要成為網球王。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366517/1_crn17p.webp', 
    },
    initialAffection: 5, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_yue': {
    id: 'classmate_yue',
    name: '林同學',
    description: '酷酷的個性，是網球隊的第一單打。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366518/3_xkymon.webp', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_old': {
    id: 'classmate_old',
    name: '老不死的家哥',
    description: '沒有人知道這個人在網球隊待了多久。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366521/5_ypv8jt.webp', 
    },
    initialAffection: -1000, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_liao': {
    id: 'classmate_liao',
    name: '廖同學',
    description: '喜歡玩音樂遊戲，成績很好，是河濱網球王。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366525/111_bezxzv.webp', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_ma': {
    id: 'classmate_ma',
    name: '麻大哥',
    description: '看屁。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366520/4_tcmzr1.webp', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_kuo': {
    id: 'classmate_kuo',
    name: '郭學長',
    description: '溫和的個性，和每個都處的很好，喜歡慢跑的帥氣學長。',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366524/8_fjbldu.webp', 
    },
    initialAffection: 0, // 初始好感度
    isLoveInterest: true,
  },
  'classmate_wu': {
    id: 'classmate_wu',
    name: '卍超‧魔甲組男卍',
    description: '超甲組',
    sprites: {
      default: 'https://res.cloudinary.com/dcpzacz9d/image/upload/v1746366522/6_mmjgl9.webp', 
    },
    initialAffection: 5,
    isLoveInterest: true,
  },
};

// Helper to get character data by ID (optional but convenient)
export const getCharacterById = (id: string): Character | undefined => CHARACTERS_DATA[id];