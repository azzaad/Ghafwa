import { requestWidgetUpdate } from 'react-native-android-widget';
import { setNativeAlarm } from '../services/AlarmService';
import { GhafwaWidget } from './GhafwaWidget';

/**
 * 🛡️ معالج مهام الويدجيت المحدث (Fixed Task Handler)
 * تم إصلاح خطأ Type checking عبر تمرير البيانات مباشرة لدالة الرندرة
 */
export async function widgetTaskHandler(props: any) {
  const { widgetAction, widgetProps } = props;

  // 1. معالجة الضغط على دورة نوم معينة (لتفعيل TickTick والمنبه)
  if (widgetAction === 'SET_ALARM') {
    const { wakeUpTime, label } = widgetProps;
    if (wakeUpTime) {
      await setNativeAlarm(new Date(wakeUpTime), label || 'غفوة مبرمجة');
    }
  }

  // 2. تحديث شكل الويدجيت (طلب التحديث البصري)
  requestWidgetUpdate({
    widgetName: 'GhafwaWidget',
    renderWidget: () => GhafwaWidget({ windows: widgetProps?.windows || [] }),
    // ✅ تم حذف سطر widgetProps الزائد الذي كان يسبب الخطأ
  });
}