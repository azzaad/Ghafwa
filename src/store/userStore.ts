import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserPersona = 'muazzin' | 'worshipper' | 'custom';

export interface UserSettings {
  fajrOffset: number;
  hijriOffset: number; 
  userPersona: UserPersona;
  reminderMinutes: number;
  autoAlarm: boolean;
  location: string;
}

const STORAGE_KEY = '@ghafwa_v10_final';

const DEFAULT_SETTINGS: UserSettings = {
  fajrOffset: 10,
  hijriOffset: 0,
  userPersona: 'worshipper',
  reminderMinutes: 10,
  autoAlarm: true,
  location: 'ريسوت',
};

export const getSettings = async (): Promise<UserSettings> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? { ...DEFAULT_SETTINGS, ...JSON.parse(json) } : DEFAULT_SETTINGS;
  } catch (e) { return DEFAULT_SETTINGS; }
};

export const saveSettings = async (settings: UserSettings): Promise<void> => {
  try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }
  catch (e) { console.error('Save failed', e); }
};