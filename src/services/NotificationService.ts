import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SleepWindow } from '../core/sleepEngine';

const CHANNEL_ID = 'ghafwa-high-priority';

/**
 * 🛡️ معالج التنبيهات المطور
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * بروتوكول تأمين الصلاحيات وإنشاء القنوات
 */
export const setupNotifications = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return false;

  // تعريف قناة الأولوية القصوى لأندرويد
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'تنبيهات غفوة الهامة',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#22D3EE',
      bypassDnd: true, // اختراق وضع عدم الإزعاج
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  return true;
};

/**
 * وظيفة الاختبار الفوري المحدثة
 */
export const triggerTestNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🔔 اختبار الربط الفوري",
      body: "نظام التنبيهات يعمل الآن بأقصى معايير الموثوقية.",
      sound: true,
    },
    trigger: { 
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      channelId: CHANNEL_ID // ✅ تم نقل معرّف القناة هنا ليتوافق مع Expo
    },
  });
};

/**
 * جدولة تنبيهات الاستعداد للنوم
 */
export const scheduleSleepReminders = async (windows: SleepWindow[], reminderMinutes: number) => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  if (reminderMinutes === 0 || !windows || windows.length === 0) return;

  for (const window of windows) {
    const alertTime = new Date(window.sleepAt.getTime() - reminderMinutes * 60000);

    // حارس المواعيد المستقبلية
    if (alertTime > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🌙 موعد ${window.type}`,
          body: `بقي ${reminderMinutes} دقائق. استيقاظك: ${window.wakeUpAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          sound: true,
          data: { type: window.type },
        },
        trigger: { 
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: alertTime,
          channelId: CHANNEL_ID // ✅ تم نقل معرّف القناة هنا
        },
      });
    }
  }
};