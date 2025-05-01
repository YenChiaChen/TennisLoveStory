import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SettingsState } from '../types';

interface SettingsActions {
  setMasterVolume: (volume: number) => void;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setTextSpeed: (speed: number) => void;
  setAutoPlayDelay: (delay: number) => void;
}

const defaultSettings: SettingsState = {
  masterVolume: 0.8,
  bgmVolume: 0.7,
  sfxVolume: 0.8,
  voiceVolume: 0.8, // Include if planning voice acting
  textSpeed: 1.0,
  autoPlayDelay: 3.0, // seconds
};

// Helper to clamp volume between 0 and 1
const clampVolume = (value: number) => Math.max(0, Math.min(1, value));

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setMasterVolume: (volume) => set({ masterVolume: clampVolume(volume) }),
      setBgmVolume: (volume) => set({ bgmVolume: clampVolume(volume) }),
      setSfxVolume: (volume) => set({ sfxVolume: clampVolume(volume) }),
      // setVoiceVolume: (volume) => set({ voiceVolume: clampVolume(volume) }),
      setTextSpeed: (speed) => set({ textSpeed: Math.max(0.5, speed) }), // Ensure minimum speed
      setAutoPlayDelay: (delay) => set({ autoPlayDelay: Math.max(0.5, delay) }), // Ensure minimum delay
    }),
    {
      name: 'rohnin-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);