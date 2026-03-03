import { getTimesFromLocalSchedule, PrayerRow } from './pdfParser';

/**
 * 🛡️ دالة مساعدة معقمة لتحويل نص الوقت إلى كائن Date
 * تعتمد الآن على `baseDate` لضمان صحة اليوم عند الإزاحة الاستباقية
 */
const parseTimeToDate = (timeStr: string, baseDate: Date = new Date()): Date => {
  if (!timeStr || typeof timeStr !== 'string') {
    throw new Error("Invalid or empty time string provided.");
  }

  const sanitizedStr = timeStr.trim();
  
  if (!/^\d{1,2}:\d{2}$/.test(sanitizedStr)) {
    throw new Error(`Malformed time format received: ${sanitizedStr}`);
  }

  const [hours, minutes] = sanitizedStr.split(':').map(Number);
  const date = new Date(baseDate); // 👈 الاعتماد على التاريخ الممرر بدلاً من اليوم الثابت
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * جلب وقت الفجر الرسمي (مع قاعدة الترحيل بعد 9 مساءً)
 */
export const getFajrTimeForToday = (currentDate: Date = new Date()): Date => {
  // 🛡️ قاعدة الإزاحة الزمنية: إذا كانت الساعة 9 مساءً (21:00) أو أكثر، اجلب فجر الغد
  const isAfter9PM = currentDate.getHours() >= 21;
  const targetDate = isAfter9PM ? new Date(currentDate.getTime() + 86400000) : currentDate;

  try {
    const localTimes = getTimesFromLocalSchedule(targetDate);
    if (localTimes && localTimes.fajr) {
      return parseTimeToDate(localTimes.fajr, targetDate); // 👈 تمرير تاريخ الغد في حالة المساء
    }
  } catch (error) {
    console.error("Fajr parsing failed, gracefully falling back:", error);
  }

  // التوقيت الافتراضي العام لريسوت (Fallback)
  const defaultFajr = new Date(targetDate);
  defaultFajr.setHours(5, 37, 0, 0);
  return defaultFajr;
};

/**
 * جلب كافة مواقيت الصلاة لليوم الحالي
 * معزول بحاجز أمان لضمان عدم توقف التطبيق
 */
export const getPrayerTimesForToday = (currentDate: Date = new Date()) => {
  const now = currentDate;
  
  try {
    const localTimes = getTimesFromLocalSchedule(now);
    if (localTimes) {
      return {
        fajr: parseTimeToDate(localTimes.fajr, now),
        dhuhr: parseTimeToDate(localTimes.dhuhr, now),
        asr: parseTimeToDate(localTimes.asr, now),
        maghrib: parseTimeToDate(localTimes.maghrib, now),
        isha: parseTimeToDate(localTimes.isha, now),
      };
    }
  } catch (error) {
    console.error("Prayer times parsing failed, gracefully falling back:", error);
  }

  // الحل الاحتياطي
  return {
    fajr: new Date(new Date(now).setHours(5, 37, 0, 0)),
    dhuhr: new Date(new Date(now).setHours(12, 30, 0, 0)),
    asr: new Date(new Date(now).setHours(15, 45, 0, 0)),
    maghrib: new Date(new Date(now).setHours(18, 10, 0, 0)),
    isha: new Date(new Date(now).setHours(19, 25, 0, 0)),
  };
};