import * as QuickActions from 'expo-quick-actions';
import { SleepWindow } from '../core/sleepEngine';

/**
 * 🛡️ خدمة محول الاختصارات (Shortcut Injection Service)
 * تقوم بحقن دورات النوم المتاحة في القائمة المنسدلة لنظام أندرويد
 */
export const updateDynamicShortcuts = async (windows: SleepWindow[], isAfter9PM: boolean) => {
  try {
    // 1. سيناريو ما قبل الـ 9 مساءً: غفوة سريعة فقط
    if (!isAfter9PM) {
      await QuickActions.setItems([
        {
          id: 'quick_nap_20',
          title: 'غفوة سريعة (20 دقيقة)',
          params: { action: 'set_alarm', durationMinutes: 20, type: 'غفوة يدوية' }
        }
      ]);
      return;
    }

    // 2. سيناريو ما بعد الـ 9 مساءً: حقن أفضل 3 دورات نوم متاحة
    const shortcutItems = windows.slice(0, 3).map((w, index) => ({
      id: `sleep_cycle_${index}`,
      title: `${w.type} (${Math.floor(w.durationMinutes / 60)}س و ${w.durationMinutes % 60}د)`,
      subtitle: `استيقاظ: ${w.wakeUpAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      params: { 
        action: 'set_alarm_exact', 
        wakeUpTime: w.wakeUpAt.toISOString(), 
        type: w.type 
      }
    }));

    await QuickActions.setItems(shortcutItems);
  } catch (error) {
    console.error("Failed to inject Android shortcuts:", error); // العزل بصمت التزاماً بسياسة الصفر-عدم
  }
};