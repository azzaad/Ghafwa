import { Platform, Alert, Linking } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';

// 1. دالة التنسيق الاحترافي (لضمان ظهور 05:39 بدلاً من 5:39 أو 4:5)
const pad = (num: number) => num.toString().padStart(2, '0');

export const setNativeAlarm = async (date: Date, label: string = 'غفوة الفجر') => {
  // 🛡️ بوابة الأمان: التأكد من صحة التاريخ ومستقبليته (من الكود القديم الناجح)
  if (!date || isNaN(date.getTime()) || date < new Date()) {
    Alert.alert("تنبيه", "وقت الاستيقاظ غير صالح أو قد مضى وقته.");
    return;
  }

  // استخراج الأرقام الصحيحة الصارمة لنظام أندرويد
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // تجهيز النص المنسق لليقين البصري (مثال: 04:05)
  const formattedTime = `${pad(hours)}:${pad(minutes)}`;

  if (Platform.OS === 'android') {
    try {
      // 🚀 المحرك الأصلي الناجح: استخدام IntentLauncher مع كائن صريح
      await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
        extra: {
          'android.intent.extra.alarm.HOUR': hours,
          'android.intent.extra.alarm.MINUTES': minutes,
          'android.intent.extra.alarm.MESSAGE': label,
          'android.intent.extra.alarm.SKIP_UI': false, // يفتح الواجهة للتأكيد
        },
        // إضافة علم المهام الجديدة لضمان عمله من الويدجيت (الخلفية) في أندرويد 14
        flags: 268435456, 
      });

      // 🕒 عزل TickTick تماماً لكي لا يكسر سياق المنبه
      setTimeout(() => {
        try {
          const isoTime = date.toISOString().replace(/\.\d+Z$/, ".000+0400");
          const tickTickUrl = `ticktick://x-callback-url/v1/add_task?title=${encodeURIComponent(label)}&startDate=${isoTime}`;
          Linking.openURL(tickTickUrl).catch(() => null);
        } catch (e) {
           // تجاهل صامت لحماية المنبه الأساسي
        }
      }, 2000);

    } catch (error) {
      console.warn("فشل IntentLauncher، يتم الانتقال للقلم الاحتياطي...");
      // 📎 القلم الثاني: الاسترداد اليقيني مع التنسيق الصحيح
      Alert.alert(
        "ضبط يدوي",
        `تعذر الفتح التلقائي. يرجى ضبط المنبه يدوياً على الساعة ${formattedTime}`,
        [
          { 
            text: "فتح الساعة", 
            onPress: () => Linking.openURL('clock-alarm://').catch(() => null) 
          },
          { text: "إلغاء", style: "cancel" }
        ]
      );
    }
  } else {
    // دعم أجهزة iOS
    Linking.openURL('calshow://');
  }
};