import SharedGroupPreferences from 'react-native-shared-group-preferences';

const GROUP_ID = 'group.com.bait.ghafwa'; // المعرف المشترك مع نظام أندرويد

/**
 * مزامنة بيانات غفوة مع الويدجيت بضغطة واحدة
 */
export const updateWidget = async (fajr: string, nextWake: string, hijri: string) => {
  const widgetData = {
    fajrTime: fajr,
    nextWakeUp: nextWake,
    hijriDate: hijri,
    lastUpdated: new Date().getTime()
  };

  try {
    await SharedGroupPreferences.setItem('ghafwa_data', widgetData, GROUP_ID);
    console.log('WidgetBridge: تم تحديث بيانات الويدجيت بنجاح [cite: 2026-02-18]');
  } catch (error) {
    // حارس الصمت: تجاهل الخطأ في بيئة Expo Go إذا لم يكن الويدجيت مدمجاً بعد
    console.log('WidgetBridge: المديول الأصلي غير متاح، تخطي المزامنة [cite: 2026-02-18]');
  }
};