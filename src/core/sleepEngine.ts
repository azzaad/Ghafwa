import { UserSettings } from '../store/userStore';

export type SleepType = 'شحن سريع' | 'دورة واحدة' | 'دورتين' | '3 دورات' | '4 دورات' | 'نومة الفجر';

export interface SleepWindow {
  type: SleepType;
  sleepAt: Date;        
  wakeUpAt: Date;       
  durationMinutes: number; 
  isOptimal?: boolean;  
  note?: string;        
}

/**
 * التحقق من وقت كراهة النوم (المغرب)
 */
const isMaghribForbidden = (now: Date, maghrib: Date, isha: Date): boolean => {
  const preMaghrib = new Date(maghrib);
  preMaghrib.setMinutes(preMaghrib.getMinutes() - 10);
  return now >= preMaghrib && now < isha;
};

/**
 * المحرك الرئيسي المحدث لحساب خيارات النوم الذكية
 */
export const calculateSmartSleepOptions = (
  now: Date,
  fajr: Date,
  maghrib: Date,
  isha: Date,
  prayerTimes: Date[], 
  settings: UserSettings
): { windows: SleepWindow[], status: 'active' | 'forbidden' } => {

  // 1. قاعدة المغرب الصارمة
  if (isMaghribForbidden(now, maghrib, isha)) {
    return { windows: [], status: 'forbidden' };
  }

  const windows: SleepWindow[] = [];
  const LATENCY = 14; 
  const cycleLength = 90;

  // 2. تطبيق قاعدة الـ 40 دقيقة بعد الصلاة
  let startTime = new Date(now);
  let note = "";

  for (const prayer of prayerTimes) {
    const bufferEnd = new Date(prayer);
    bufferEnd.setMinutes(bufferEnd.getMinutes() + 40);
    if (now >= prayer && now < bufferEnd) {
      startTime = bufferEnd;
      note = "تأخير لأداء الصلاة (قاعدة 40د)";
      break; 
    }
  }

  // 3. حساب هدف الاستيقاظ للفجر بناءً على إعدادات المستخدم (مؤذن/مصلي)
  const fajrWakeTarget = new Date(fajr);
  fajrWakeTarget.setMinutes(fajrWakeTarget.getMinutes() + settings.fajrOffset);

  // 4. توليد دورات النوم (90 دقيقة + 14 دقيقة غفوة)
  for (let i = 1; i <= 4; i++) {
      const cycleDuration = (i * cycleLength);
      const totalDuration = cycleDuration + LATENCY; 
      const wakeTime = new Date(startTime);
      wakeTime.setMinutes(wakeTime.getMinutes() + totalDuration);

      // لا تقترح دورة تتجاوز وقت الفجر المحدد
      if (wakeTime > fajrWakeTarget) break;

      let label: SleepType = 'دورة واحدة';
      if (i === 2) label = 'دورتين';
      if (i === 3) label = '3 دورات';
      if (i === 4) label = '4 دورات';

      windows.push({
          type: label,
          sleepAt: startTime,
          wakeUpAt: wakeTime,
          durationMinutes: totalDuration,
          isOptimal: true,
          note: note
      });
  }

  // 5. [تحديث] إضافة "نومة الفجر" طالما بقي 30 دقيقة فأكثر
  if (fajrWakeTarget > now) {
      const diffMins = (fajrWakeTarget.getTime() - now.getTime()) / 60000;
      if (diffMins > 30) { 
           windows.push({
              type: 'نومة الفجر',
              sleepAt: now,
              wakeUpAt: fajrWakeTarget,
              durationMinutes: Math.floor(diffMins),
              note: settings.userPersona === 'muazzin' ? 'تنبيه المؤذن' : 'تنبيه المصلي'
          });
      }
  }

  // 6. [تحديث] إضافة "قيلولة قصيرة" (شحن سريع) كخيار طوارئ إذا فرغت القائمة
  if (windows.length === 0 && !isMaghribForbidden(now, maghrib, isha)) {
      const remainingToFajr = (fajrWakeTarget.getTime() - now.getTime()) / 60000;
      if (remainingToFajr > 20) {
          windows.push({
              type: 'شحن سريع',
              sleepAt: now,
              wakeUpAt: new Date(now.getTime() + 20 * 60000),
              durationMinutes: 20,
              note: "خيار سريع قبل الفجر"
          });
      }
  }

  return { windows, status: 'active' };
};