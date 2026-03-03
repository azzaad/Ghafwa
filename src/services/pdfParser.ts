/**
 * 🕌 محرك البيانات التقويمي - إصدار رمضان 1447هـ
 * ولاية صلالة - ريسوت
 */

export interface PrayerRow {
  fajr: string;
  shuruq: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/**
 * البيانات المستخرجة من الجدول الرسمي لوزارة الأوقاف والشؤون الدينية
 * الفترة: من 1 رمضان (19 فبراير) إلى 29 رمضان (19 مارس)
 */
const RAMADAN_SCHEDULE: Record<string, PrayerRow> = {
  "2026-02-19": { fajr: "05:35", shuruq: "06:48", dhuhr: "12:42", asr: "04:03", maghrib: "18:32", isha: "19:40" },
  "2026-02-20": { fajr: "05:35", shuruq: "06:47", dhuhr: "12:42", asr: "04:03", maghrib: "18:32", isha: "19:40" },
  "2026-02-21": { fajr: "05:34", shuruq: "06:47", dhuhr: "12:42", asr: "04:03", maghrib: "18:33", isha: "19:40" },
  "2026-02-22": { fajr: "05:34", shuruq: "06:46", dhuhr: "12:42", asr: "04:03", maghrib: "18:33", isha: "19:41" },
  "2026-02-23": { fajr: "05:33", shuruq: "06:46", dhuhr: "12:42", asr: "04:03", maghrib: "18:33", isha: "19:41" },
  "2026-02-24": { fajr: "05:33", shuruq: "06:45", dhuhr: "12:42", asr: "04:03", maghrib: "18:34", isha: "19:41" },
  "2026-02-25": { fajr: "05:32", shuruq: "06:44", dhuhr: "12:42", asr: "04:03", maghrib: "18:34", isha: "19:41" },
  "2026-02-26": { fajr: "05:32", shuruq: "06:44", dhuhr: "12:41", asr: "04:03", maghrib: "18:34", isha: "19:42" },
  "2026-02-27": { fajr: "05:31", shuruq: "06:43", dhuhr: "12:41", asr: "04:03", maghrib: "18:35", isha: "19:42" },
  "2026-02-28": { fajr: "05:30", shuruq: "06:42", dhuhr: "12:41", asr: "04:03", maghrib: "18:35", isha: "19:42" },
  "2026-03-01": { fajr: "05:30", shuruq: "06:42", dhuhr: "12:41", asr: "04:03", maghrib: "18:35", isha: "19:42" },
  "2026-03-02": { fajr: "05:29", shuruq: "06:41", dhuhr: "12:41", asr: "04:03", maghrib: "18:35", isha: "19:43" },
  "2026-03-03": { fajr: "05:28", shuruq: "06:40", dhuhr: "12:40", asr: "04:02", maghrib: "18:36", isha: "19:43" },
  "2026-03-04": { fajr: "05:28", shuruq: "06:40", dhuhr: "12:40", asr: "04:02", maghrib: "18:36", isha: "19:43" },
  "2026-03-05": { fajr: "05:27", shuruq: "06:39", dhuhr: "12:40", asr: "04:02", maghrib: "18:36", isha: "19:43" },
  "2026-03-06": { fajr: "05:26", shuruq: "06:38", dhuhr: "12:40", asr: "04:02", maghrib: "18:36", isha: "19:43" },
  "2026-03-07": { fajr: "05:26", shuruq: "06:38", dhuhr: "12:40", asr: "04:02", maghrib: "18:37", isha: "19:44" },
  "2026-03-08": { fajr: "05:25", shuruq: "06:37", dhuhr: "12:39", asr: "04:02", maghrib: "18:37", isha: "19:44" },
  "2026-03-09": { fajr: "05:24", shuruq: "06:36", dhuhr: "12:39", asr: "04:01", maghrib: "18:37", isha: "19:44" },
  "2026-03-10": { fajr: "05:24", shuruq: "06:36", dhuhr: "12:39", asr: "04:01", maghrib: "18:37", isha: "19:44" },
  "2026-03-11": { fajr: "05:23", shuruq: "06:35", dhuhr: "12:39", asr: "04:01", maghrib: "18:38", isha: "19:45" },
  "2026-03-12": { fajr: "05:22", shuruq: "06:34", dhuhr: "12:38", asr: "04:01", maghrib: "18:38", isha: "19:45" },
  "2026-03-13": { fajr: "05:21", shuruq: "06:33", dhuhr: "12:38", asr: "04:01", maghrib: "18:38", isha: "19:45" },
  "2026-03-14": { fajr: "05:21", shuruq: "06:33", dhuhr: "12:38", asr: "04:00", maghrib: "18:38", isha: "19:45" },
  "2026-03-15": { fajr: "05:20", shuruq: "06:32", dhuhr: "12:37", asr: "04:00", maghrib: "18:38", isha: "19:45" },
  "2026-03-16": { fajr: "05:19", shuruq: "06:31", dhuhr: "12:37", asr: "04:00", maghrib: "18:39", isha: "19:46" },
  "2026-03-17": { fajr: "05:18", shuruq: "06:30", dhuhr: "12:37", asr: "03:59", maghrib: "18:39", isha: "19:46" },
  "2026-03-18": { fajr: "05:18", shuruq: "06:29", dhuhr: "12:37", asr: "03:59", maghrib: "18:39", isha: "19:46" },
  "2026-03-19": { fajr: "05:17", shuruq: "06:29", dhuhr: "12:36", asr: "03:59", maghrib: "18:39", isha: "19:46" },
};

/**
 * دالة جلب الأوقات من الجدول المحلي بناءً على تاريخ اليوم
 */
export const getTimesFromLocalSchedule = (date: Date): PrayerRow | null => {
  const key = date.toISOString().split('T')[0];
  return RAMADAN_SCHEDULE[key] || null;
};