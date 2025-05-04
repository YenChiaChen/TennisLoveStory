import type { Ending } from '../types';

// 務必替換成實際圖片路徑 public/assets/images/endings/
export const ENDINGS_DATA: Record<string, Ending> = {
  'senpai_A_good': {
    id: 'senpai_A_good',
    characterId: 'senpai_A',
    name: '與 A 前輩的未來',
    text: [
      "陽光灑在球場上，A 前輩笑著向我走來。",
      "「肉泥，畢業後也一起打網球吧！」",
      "看著他閃耀的笑容，我知道，我們的故事才正要開始...",
      "(獲得 CG: A 前輩結局圖)"
    ],
    cgPath: '/assets/images/endings/senpai_A_good_cg.jpg',
    isGoodEnding: true,
  },
  'classmate_B_good': {
    id: 'classmate_B_good',
    characterId: 'classmate_B',
    name: '冰山下的溫柔',
    text: [
      "圖書館的角落，B 同學難得露出了微笑。",
      "「...以後也像這樣，一起讀書嗎？」",
      "雖然還是有點酷，但我知道，這就是他表達溫柔的方式。",
      "(獲得 CG: B 同學結局圖)"
    ],
    cgPath: '/assets/images/endings/classmate_B_good_cg.jpg',
    isGoodEnding: true,
  },
  'normal_end': {
      id: 'normal_end',
      name: '一事無成的人生',
      text: [
          "大學生活匆匆而過，我沒有參加任何社團，也沒有交到任何朋友。",
          "畢業後面試到了清潔隊員。",
          "就這樣過完了這生…",
          "(完成結局：清潔隊大隊長)"
      ],
      isGoodEnding: false, // 標示為普通結局
  }
  // Add more endings (bad ends, other characters)
};

export const getEndingById = (id: string): Ending | undefined => ENDINGS_DATA[id];