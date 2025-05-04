export interface Ending {
    id: string; // Unique ending ID (e.g., 'senpai_A_good_end', 'normal_end')
    characterId?: string; // Associated character ID (if character specific)
    name: string; // Ending name displayed (e.g., "與 A 前輩的未來", "孤單的結局")
    text: string | string[]; // Ending text content
    cgPath?: string; // Path to ending CG image (optional)
    isGoodEnding: boolean; // Flag for distinguishing ending types
  }