import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExamResult } from './examEngine';

const HISTORY_KEY = '@nauta_exam_history';
const SETTINGS_KEY = '@nauta_settings';

export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: true,
  soundEnabled: true,
  hapticEnabled: true,
};

/**
 * Save an exam result to history
 */
export async function saveExamResult(result: ExamResult): Promise<void> {
  try {
    const history = await getExamHistory();
    history.unshift(result); // newest first
    // Keep max 50 results
    const trimmed = history.slice(0, 50);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save exam result:', error);
  }
}

/**
 * Get all exam history
 */
export async function getExamHistory(): Promise<ExamResult[]> {
  try {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to load exam history:', error);
    return [];
  }
}

/**
 * Clear all exam history
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

/**
 * Get app settings
 */
export async function getSettings(): Promise<AppSettings> {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    return json ? { ...DEFAULT_SETTINGS, ...JSON.parse(json) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save app settings
 */
export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
